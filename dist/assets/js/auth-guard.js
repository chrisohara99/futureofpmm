// Auth bypass for BTP deployment — authentication is handled by XSUAA SSO at the network level.
document.documentElement.style.display = '';
window.pmmCurrentUser = JSON.parse(localStorage.getItem('pmm_direct_user') || 'null') || { email: 'sap-user@sap.com' };
