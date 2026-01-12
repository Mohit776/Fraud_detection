import React from 'react'
import { startLoading, stopLoading } from "../features/loading/loadingSlice";
import { useSelector, useDispatch } from 'react-redux';
import ResultTab from '../components/ResultTab';
import { RESULT_TABS } from "../constants/tabs";
import ContractAnomaly from '../components/tabs/ContractAnomaly';
import TopBidders from '../components/tabs/TopBidder';
import ExpenditureFaults from '../components/tabs/ExpenditureFaults';
import UnusualClaims from '../components/tabs/UnusualClaims';

const COMPONENT_MAP = {
  contract: ContractAnomaly,
  bidders: TopBidders,
  expenditure: ExpenditureFaults,
  oddclaims: UnusualClaims, // ✅ 5th component
};

const ResultPage = () => {
  const dispatch = useDispatch();
  dispatch(startLoading());

  setTimeout(() => {
    dispatch(stopLoading());
  }, 1500);

  const activeTab = useSelector(
    (state) => state.resultTab.activeTab
  );
  const ActiveComponent = COMPONENT_MAP[activeTab];
  return (
    <div className='bg-gray-100 dark:bg-gray-900 h-400 overflow-hidden relative'>
      {/* Title and description */}
      <div id='Title' className='text-white ml-40'>
        <div className="text-5xl mt-30 ">Analysis Report</div>
        <div className="text-xl mt-10">Here you go !!🤩 Check out this report with all suspicions in the provided records</div>
      </div>
      {/* Title and Description */}

      <div id='ResultTab' className=' mt-20 justify-center items-center'><ResultTab /></div>
      {/* Dynamic Component Rendering based on active tab */}
      <ActiveComponent />;

    </div>
  )
}

export default ResultPage