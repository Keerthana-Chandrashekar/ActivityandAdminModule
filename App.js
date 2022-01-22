import './App.css'; 
import ActivityList from './components/ActivityList';
import AdminProfile from './components/AdminProfile';
import HeaderBar from './components/HeaderBar';
import NewAdminModule from './components/NewAdminModule';

function App() {
  return (
    <div className="App">
        <HeaderBar/>
        {/* <AdminProfile/> */}
        {/* <ActivityList/> */}
        <NewAdminModule/>
    </div>
  );
}

export default App;
