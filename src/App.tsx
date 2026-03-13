import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { ThunderboltOutlined, BarChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AppliancesPage from './pages/AppliancesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CatalogPage from './pages/CatalogPage';
import './App.css';

const { Header, Content } = Layout;

function NavMenu() {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'appliances';
  const selected = path === 'analytics' ? ['analytics'] : path === 'catalog' ? ['catalog'] : ['appliances'];
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={selected}
      style={{ flex: 1, minWidth: 0 }}
      items={[
        { key: 'appliances', icon: <ThunderboltOutlined />, label: <NavLink to="/">Приборы</NavLink> },
        { key: 'analytics', icon: <BarChartOutlined />, label: <NavLink to="/analytics">Аналитика</NavLink> },
        { key: 'catalog', icon: <UnorderedListOutlined />, label: <NavLink to="/catalog">Каталог</NavLink> },
      ]}
    />
  );
}

function App() {
  return (
    <BrowserRouter basename="/Energy-Tracker">
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <NavMenu />
        </Header>
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<AppliancesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
