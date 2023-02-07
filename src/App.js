import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LogIn/LogInForm";
import RegisterForm from "./components/LogIn/RegisterForm";
import Contacts from "./components/Contacts/Contacts";
import Layout from "./components/Layout/Layout";
import NoPage from "./components/NoPage/NoPage";
import { AuthProvider } from "./context/AuthenticationContext";
import PrivateRoute from "./components/Contacts/PrivateRoute";
import ContactPreview from "./components/Contacts/ContactPreview";
import FavouriteContact from "./components/Contacts/FavouriteContact";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div className="App-header">
            <Layout>
              <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route exact path="register" element={<RegisterForm />} />
                <Route
                  path="contacts"
                  element={
                    <PrivateRoute>
                      <Contacts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="contacts/:contactId"
                  element={
                    <PrivateRoute>
                      <ContactPreview />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contacts/favourites"
                  element={
                    <PrivateRoute>
                      <FavouriteContact />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </Layout>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
