"""
Bid Rigging & Collusion Detection Router.
Uses NetworkX graph to detect cartels and collusion patterns.
"""
from fastapi import APIRouter, HTTPException
import networkx as nx

from models.loader import get_model
from schemas import BidRiggingRequest, BidRiggingResponse, ConnectionInfo

router = APIRouter(prefix="/bidrigging", tags=["Bid Rigging Detection"])


@router.post("/analyze", response_model=BidRiggingResponse)
async def analyze_vendor(request: BidRiggingRequest):
    """
    Analyze a vendor for bid rigging and collusion patterns.
    
    Uses graph network analysis to detect:
    - Vendors who frequently bid together
    - Cartel membership (connected components)
    - Suspicious connection patterns
    """
    graph = get_model("bid_rigging_graph")
    vendor_names = get_model("vendor_names")
    
    if graph is None or vendor_names is None:
        raise HTTPException(
            status_code=503, 
            detail="Bid rigging models not loaded"
        )
    
    vendor_id = request.vendor_id
    
    # Check if vendor exists in graph
    if vendor_id not in graph:
        raise HTTPException(
            status_code=404,
            detail=f"Vendor {vendor_id} not found in network"
        )
    
    # Get vendor name
    vendor_name = vendor_names.get(vendor_id, "Unknown")
    
    # Get connections (neighbors in the graph)
    neighbors = list(graph.neighbors(vendor_id))
    total_connections = len(neighbors)
    
    # Find the cartel (connected component) this vendor belongs to
    connected_components = list(nx.connected_components(graph))
    vendor_cartel = None
    cartel_size = None
    
    for component in connected_components:
        if vendor_id in component:
            vendor_cartel = component
            cartel_size = len(component)
            break
    
    # Is this a large cartel? (>= 3 members is suspicious per the notebook)
    is_in_cartel = cartel_size is not None and cartel_size >= 3
    
    # Get top connections with weights
    top_connections = []
    edges_with_weights = []
    
    for neighbor in neighbors:
        edge_data = graph.get_edge_data(vendor_id, neighbor)
        weight = edge_data.get("weight", 1) if edge_data else 1
        edges_with_weights.append((neighbor, weight))
    
    # Sort by weight (most co-bids) and take top 10
    edges_with_weights.sort(key=lambda x: x[1], reverse=True)
    
    for neighbor, weight in edges_with_weights[:10]:
        neighbor_name = vendor_names.get(neighbor, "Unknown")
        top_connections.append(ConnectionInfo(
            vendor_id=neighbor,
            vendor_name=neighbor_name[:50] if neighbor_name else None,
            connection_weight=weight
        ))
    
    # Determine risk level
    if is_in_cartel and cartel_size >= 10:
        risk_level = "🔴 HIGH (Large Cartel Detected)"
    elif is_in_cartel:
        risk_level = "🟡 MEDIUM (Cartel Member)"
    elif total_connections > 50:
        risk_level = "🟡 MEDIUM (Many Connections)"
    else:
        risk_level = "🟢 LOW (Normal Bidding Pattern)"
    
    return BidRiggingResponse(
        vendor_id=vendor_id,
        vendor_name=vendor_name[:100] if vendor_name else None,
        total_connections=total_connections,
        is_in_cartel=is_in_cartel,
        cartel_size=cartel_size,
        top_connections=top_connections,
        risk_level=risk_level
    )


@router.get("/network-stats")
async def get_network_stats():
    """
    Get overall statistics about the bid rigging network.
    """
    graph = get_model("bid_rigging_graph")
    
    if graph is None:
        raise HTTPException(status_code=503, detail="Bid rigging graph not loaded")
    
    # Get connected components (potential cartels)
    connected_components = list(nx.connected_components(graph))
    large_cartels = [c for c in connected_components if len(c) >= 3]
    
    return {
        "total_vendors": graph.number_of_nodes(),
        "total_connections": graph.number_of_edges(),
        "total_cartels": len(large_cartels),
        "largest_cartel_size": max(len(c) for c in connected_components) if connected_components else 0
    }


@router.get("/list-vendors")
async def list_vendors(limit: int = 50, offset: int = 0):
    """
    List vendors in the network with pagination.
    """
    graph = get_model("bid_rigging_graph")
    vendor_names = get_model("vendor_names")
    
    if graph is None or vendor_names is None:
        raise HTTPException(status_code=503, detail="Bid rigging models not loaded")
    
    nodes = list(graph.nodes())[offset:offset + limit]
    
    vendors = []
    for node in nodes:
        name = vendor_names.get(node, "Unknown")
        vendors.append({
            "vendor_id": node,
            "vendor_name": name[:100] if name else "Unknown",
            "connection_count": len(list(graph.neighbors(node)))
        })
    
    return {
        "vendors": vendors,
        "total": graph.number_of_nodes(),
        "limit": limit,
        "offset": offset
    }
