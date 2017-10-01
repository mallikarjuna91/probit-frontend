import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import TradePage from '../../pages/TradePage/page';
import Dashboard from '../../pages/Dashboard/page';
import ProbitDashboard from '../../pages/ProbitDashboard/page';


export default (
      <Route path="/" component={App}>
        <IndexRoute component={TradePage} />
        <Route path="dashboard" component={Dashboard} />
        <Route path="probitdashboard" component={ProbitDashboard} />
      </Route>
);
