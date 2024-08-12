import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import './assets/tailwind.css';
import { store } from './store';
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SnackbarProvider maxSnack={3}>
			<Provider store={store}>
				<App />
			</Provider>
		</SnackbarProvider>
	</React.StrictMode>
);
