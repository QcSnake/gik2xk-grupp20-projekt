import './App.css';
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	BottomNavigationAction,
	BottomNavigation,
} from '@mui/material';

import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

import ContactMailIcon from '@mui/icons-material/ContactMail';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import CartMain from './views/CartMain';
import Products from './views/Products';
import ProductDetail from './views/ProductDetail';
import ProductEdit from './views/ProductEdit';
import Users from './views/Users';
import UsersEdit from './views/UsersEdit';
import ReviewEdit from './views/ReviewEdit';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import Register from './views/Register';
import React, { useEffect, useState } from 'react';
import { getCurrentUser, logout, isAdmin } from './models/authModel';

function App() {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Check if user is logged in
		const loggedInUser = getCurrentUser();
		setUser(loggedInUser);
	}, []);

	const handleLogout = () => {
		logout();
		setUser(null);
		navigate('/login');
	};

	return (
		<div className="App">
			<h1>Webbshop</h1>

			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="fixed">
					<Toolbar>
						<Typography
							variant="h6"
							component="div"
							sx={{ flexGrow: 0, marginRight: 2 }}
						>
							<SportsEsportsIcon />
							<Link to="/products">Spel</Link>
							<SportsEsportsIcon />
						</Typography>

						{user ? (
							<>
								{isAdmin() && (
									<Typography
										variant="h6"
										component="div"
										sx={{ flexGrow: 0, marginRight: 2 }}
									>
										<Link to="/admin">
											<DashboardIcon />
											Admin
										</Link>
									</Typography>
								)}

								<Typography
									variant="h6"
									component="div"
									sx={{ flexGrow: 1 }}
								>
									<Link to={`/users/${user.id}`}>
										{user.f_name} {user.l_name}
										<PersonIcon />
									</Link>
								</Typography>

								<Button color="inherit" onClick={handleLogout}>
									<LogoutIcon />
									Logga ut
								</Button>

								<Button color="inherit">
									<Link to="/cart">
										<LocalGroceryStoreIcon />
									</Link>
								</Button>
							</>
						) : (
							<Typography
								variant="h6"
								component="div"
								sx={{ flexGrow: 1 }}
							>
								<Link to="/login">Logga in</Link>
							</Typography>
						)}
					</Toolbar>
				</AppBar>
			</Box>

			<div style={{ marginTop: '80px', paddingBottom: '60px' }}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/products" element={<Products />} />
					<Route path="/cart" element={<CartMain />} />
					<Route path="/users/:id" element={<Users />} />
					<Route path="/productDetail/:id" element={<ProductDetail />} />
					<Route path="/productDetail/new" element={<ProductDetail />} />
					<Route path="/productDetail/:id/edit" element={<ProductEdit />} />
					<Route path="/productEdit/:id" element={<ProductEdit />} />
					<Route path="/UsersEdit/:id" element={<UsersEdit />} />
					<Route path="/ReviewEdit/:id" element={<ReviewEdit />} />
					<Route path="/" element={<Products />} />
				</Routes>
			</div>

			<Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
				<BottomNavigation
					className="Box"
					value="#"
					style={{ background: '#263238' }}
				>
					<Typography sx={{ color: '#ffd600', paddingTop: '1rem' }}>
						Kontakta oss
						<a href="mailto:h23abmuh@du.se">
							<BottomNavigationAction
								sx={{ color: '#ffd600' }}
								icon={<ContactMailIcon sx={{ color: '#ffd600' }} />}
							/>
						</a>
					</Typography>
				</BottomNavigation>
			</Box>
		</div>
	);
}

export default App;
