import React from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import MenuPage from '../pages/MenuPage'
import NotFoundPage from '../pages/NotFoundPage'
import RateContract from '../component/masters/assam/services/RateContract'
import AssamPrivateRoute from './AssamPrivateRoute'
import JharkhandPrivateRoute from './JharkhandPrivateRoute'
import RateContractJH from '../component/masters/jharkhand/services/RateContract'
import RateContractAddForm from '../component/masters/jharkhand/services/RateContract/RateContractAdd'
import BankMaster from '../component/masters/jharkhand/admin/lists/BankMaster'
import BankBranchMaster from '../component/masters/jharkhand/admin/lists/BankBranchMaster'
import MenuTopBar from '../component/headers/MenuTopBar'
import BankMasterList from '../component/masters/assam/admin/lists/BankMasterList'

const MasterRoute = () => {
  const { stateCode } = useParams();
  return (

    <>
      {(stateCode && stateCode === "AS") &&
        <MenuTopBar title={"AMSCL, Govt. of Assam"} subtitle={"DVDMS (e-Aushadhi)"} logoUrl={"/logo.png"} isEmail={true} isLocation={true} bg={"#00000073"} />
      }
      {(stateCode && stateCode === "JH") &&
        <MenuTopBar title={"JMHIDPCL i-MCS"} subtitle={"Jharkhand Medical & Health Infrastructure Development & Procurement Corporation Ltd."} logoUrl={"/JH_Logo.png"} isEmail={true} isLocation={true} bg={"#00000073"} />
      }
      <Routes>
        {/* ASSAM */}
        {stateCode === "AS" &&
          <Route element={<AssamPrivateRoute />}>

            {/* SEVICES */}
            <Route path="/rate-contract" element={<RateContract />} />

          </Route>
        }

        {/* JHARKHAND */}
        {stateCode === "JH" &&
          <Route element={<JharkhandPrivateRoute />}>

            {/* SERVICES */}
            <Route path="/rate-contract" element={<RateContractJH />} />
            <Route path="/rate-contract/add" element={<RateContractAddForm />} />

            {/* ADMIN */}
            <Route path="/bank-master" element={<BankMasterList />} />
            <Route path="/bank-branch-master" element={<BankBranchMaster />} />
          </Route>
        }

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default MasterRoute
