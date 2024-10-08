import { AppBar, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { PendingRegisterTab } from '../../components/pendingApproval/tabs/PendingRegisterTab';
import { TabPanel } from '../../styles/theme/components/TabPanel';
import { TAB_PENDING_REGISTER } from '../../types/employee';

export const PendingApprovalPage = () => {
  const [tab, setTab] = useState(0);

  const handleChangeTab = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }

  return (
    <>
      <AppBar position="sticky" color="default">
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            label="Duyệt đăng ký"
          />
          <Tab
            label="Duyệt thăng chức"
          />
          <Tab
            label="Duyệt tăng lương"
          />
          <Tab
            label="Duyệt đề xuất"
          />
        </Tabs>
      </AppBar>

      <TabPanel value={tab} index={TAB_PENDING_REGISTER} >
        <PendingRegisterTab />
      </TabPanel>
      {/* <TabPanel value={tab} index={TAB_PENDING_PROMOTED} >
        <WaitingPromoteTab t={t} />
      </TabPanel>
      <TabPanel value={tab} index={TAB_PENDING_SARALY} >
        <WaitingSalaryTab t={t} />
      </TabPanel>
      <TabPanel value={tab} index={TAB_PENDING_PROPOSAL} >
        <WaitingProposalTab t={t} />
      </TabPanel> */}
    </>
  )
}
