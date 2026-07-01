import { commonApi } from "./commonAPI";
import { BASE_URL } from "./baseUrl";

// User Registration
export const registerUserAPI = async (user) => {
    return await commonApi(`${BASE_URL}/register`, "POST", user, "")
}

// Generic Login (User, Provider, Admin)
export const loginAPI = async (user) => {
    return await commonApi(`${BASE_URL}/login`, "POST", user, "")
}

// User Login 
export const loginUserAPI = async (user) => {
    return await commonApi(`${BASE_URL}/login`, "POST", user, "")
}

// Provider Registration
export const registerProviderAPI = async (provider, headers) => {
    return await commonApi(`${BASE_URL}/provider-register`, "POST", provider, headers)
}

// Admin
export const getAllProvidersAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/all-providers`, "GET", "", header)
}

export const updateProviderStatusAPI = async (id, statusData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/provider-status/${id}`, "PATCH", statusData, header)
}

export const getAllUsersAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/all-users`, "GET", "", header)
}

export const getAllServicesAdminAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/all-services`, "GET", "", header)
}

export const deleteServiceAdminAPI = async (id) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/delete-service/${id}`, "DELETE", {}, header)
}

export const deleteUserAdminAPI = async (id) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/delete-user/${id}`, "DELETE", {}, header)
}

export const deleteProviderAdminAPI = async (id) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/delete-provider/${id}`, "DELETE", {}, header)
}

// Approved Providers
export const getApprovedProvidersAPI = async () => {
    return await commonApi(`${BASE_URL}/approved-providers`, "GET", "", "")
}

export const getProviderDetailsAPI = async (id) => {
    return await commonApi(`${BASE_URL}/get-provider-details/${id}`, "GET", "", "")
}

// Provider Login 
export const loginProviderAPI = async (provider) => {
    return await commonApi(`${BASE_URL}/login`, "POST", provider, "")
}

// Update Provider Profile
export const updateProviderProfileAPI = async (id, formData) => {
    const header = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Token ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${BASE_URL}/update-provider-profile/${id}`, "PATCH", formData, header)
}

//Services

export const addServiceAPI = async (providerId, serviceData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/add-service/${providerId}`, "POST", serviceData, header)
}

export const getProviderServicesAPI = async (providerId) => {
    return await commonApi(`${BASE_URL}/provider-services/${providerId}`, "GET", "", "")
}

export const getSingleServiceAPI = async (serviceId) => {
    return await commonApi(`${BASE_URL}/get-service/${serviceId}`, "GET", "", "")
}

export const updateServiceAPI = async (serviceId, serviceData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/update-service/${serviceId}`, "PATCH", serviceData, header)
}

export const deleteServiceAPI = async (serviceId) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/delete-service/${serviceId}`, "DELETE", {}, header)
}

// Booking
export const createBookingAPI = async (bookingData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/create`, "POST", bookingData, header)
}

export const getUserBookingsAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/user`, "GET", "", header)
}

export const getProviderBookingsAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/provider`, "GET", "", header)
}

export const updateBookingStatusAPI = async (id, statusData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/status/${id}`, "PATCH", statusData, header)
}

export const submitReviewAPI = async (id, reviewData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/review/${id}`, "PATCH", reviewData, header)
}

export const getBookedSlotsAPI = async (providerId, date) => {
    return await commonApi(`${BASE_URL}/bookings/booked-slots?providerId=${providerId}&date=${date}`, "GET", "", "")
}

export const getValidSlotsAPI = async (providerId, serviceId, date) => {
    return await commonApi(`${BASE_URL}/bookings/valid-slots?providerId=${providerId}&serviceId=${serviceId}&date=${date}`, "GET", "", "")
}

export const getProviderReviewsAPI = async (providerId) => {
    return await commonApi(`${BASE_URL}/reviews/provider/${providerId}`, "GET", "", "")
}



export const updateUserProfileAPI = async (id, userData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/update-user-profile/${id}`, "PATCH", userData, header)
}

export const deleteReviewAPI = async (id) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/review/${id}`, "DELETE", {}, header)
}

export const deleteBookingAPI = async (id) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/${id}`, "DELETE", {}, header)
}

export const bookingStripeAPI = async (bookingData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/stripe`, "POST", bookingData, header)
}

export const confirmPaymentAPI = async (paymentData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/bookings/confirm-payment`, "POST", paymentData, header)
}

export const getProviderBookingsForAdminAPI = async (providerId) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/admin/bookings/provider/${providerId}`, "GET", "", header)
}

// Complaints
export const createComplaintAPI = async (complaintData) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/complaints`, "POST", complaintData, header)
}

export const getProviderComplaintsAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/complaints/provider`, "GET", "", header)
}

export const getAllComplaintsAdminAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/complaints/admin`, "GET", "", header)
}

export const getUserComplaintsAPI = async () => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/complaints/user`, "GET", "", header)
}

export const deleteComplaintAPI = async (id) => {
    const header = { "Authorization": `Token ${sessionStorage.getItem('token')}` }
    return await commonApi(`${BASE_URL}/complaints/${id}`, "DELETE", {}, header)
}



