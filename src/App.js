import React, { Suspense, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import './styles/app.scss'
import {httpClient} from './httpClient.js'
import { Button, Typography } from "@material-ui/core";

const LoginComponent = React.lazy(() => import("./page/LoginComponent.jsx"))
const Layout = React.lazy(() => import("./layout/Layout.jsx"))

const UserPage = React.lazy(() => import("./page/Users"))
const InventoryPage = React.lazy(() => import("./page/Inventory"))
const VehiclePage = React.lazy(() => import("./page/VehiclePage"))
const InvoicePage = React.lazy(() => import("./page/InvoicePage"))
const RequestPage = React.lazy(() => import("./page/RequestPage"))
const GenerateInvoice = React.lazy(() => import("./page/CreateInvoice"))
const Dashboard = React.lazy(() => import("./page/Dashboard"))
const Invoice = React.lazy(() => import("./page/ViewInvoice"))
const Profile = React.lazy(() => import("./page/ProfilePage"))

const INVENTORY_MANAGEMENT_PATH = "/admin/management/inventory";
const REQUEST_MANAGEMENT_PATH = "/admin/management/requests";
const USER_MANAGEMENT_PATH = "/admin/management/users";
const PROFILE_PATH = "/admin/profile";
const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const VEHICLE_PAGE_PATH = "/admin/management/inventory/vehicle";
const GENERATE_INVOICE_PATH = "/admin/management/generate/invoice";
const INVOICES_TABLE_PATH = "/admin/management/invoices";
const VIEW_INVOICE_PAGE = "/admin/management/invoices/view";



function AdministrativePages(props) {
    return (
        <>
            <Suspense fallback={<></>} >
                <Layout state={props.state} render={() => {
                    return (
                        <Routes>
                            <Route path={VEHICLE_PAGE_PATH} element={<VehiclePage state={props.state} />} />
                            <Route
                                path={INVENTORY_MANAGEMENT_PATH}
                                element={<InventoryPage state={props.state} />}
                            />
                            <Route
                                path={REQUEST_MANAGEMENT_PATH}
                                element={<RequestPage state={props.state} />}
                            />
                            {props.state?.access?.includes('admin') ? (
                                <Route path={USER_MANAGEMENT_PATH} element={<UserPage state={props.state} />} />
                            ) : (
                                <Route path={USER_MANAGEMENT_PATH} element={<div className="table-loading">
                                    <Typography variant="button">
                                        You are not allowed access to this content.
                                    </Typography>
                                </div>} />
                            )}

                            <Route path={PROFILE_PATH} element={<Profile state={props.state} />} />
                            <Route
                                path={ADMIN_DASHBOARD_PATH}
                                element={<Dashboard state={props.state} />}
                            />
                            <Route
                                path="/"
                                element={<Dashboard state={props.state} />}
                            />
                            <Route exact path={GENERATE_INVOICE_PATH} element={<GenerateInvoice state={props.state} />} />
                            <Route
                                path={INVOICES_TABLE_PATH}
                                element={<InvoicePage state={props.state} />}
                            />
                            <Route
                                path={VIEW_INVOICE_PAGE}
                                element={<Invoice state={props.state} />}
                            />
                        </Routes>)
                }
                } />
            </Suspense>
        </>
    )
}

function ConnectionComponent() {

    const reloadPage = () => {
        window.location.reload()
    }
    return (
        <div className="table-loading">
            <Typography variant="button">
                Check Your Internet Connection
            </Typography> <br />
            <Button onClick={reloadPage} >Reload Page</Button>
        </div>
    )
}


export default function App() {
    const [admin, setAdmin] = useState(null);
    const [loaded, setLoad] = useState(false);
    const [connection, setConnection] = useState(true)


    const authState = () => {
        setConnection(true)
        httpClient().get("/authState")
            .then(res => {
                const body = res.data
                if (body.status) {
                    const user = body.content
                    if (user !== "NO_USER") {
                        setAdmin(user)
                    }
                }

                setLoad(true)
            })
            .catch(err => { setLoad(true); setConnection(false) })
    }

    useEffect(() => {
        authState()
    }, [])

    if (loaded) {
        return (
            <Router>
                <Routes>
                    {admin === null ? (
                        <>
                            {connection ? (
                                <Route path="/*"
                                    element={
                                        <Suspense fallback={<></>}>
                                            <LoginComponent setAdmin={setAdmin} />
                                        </Suspense>
                                    }
                                />
                            ) : (
                                <Route path="/*"
                                    element={<ConnectionComponent />}
                                />
                            )}
                        </>

                    ) : (
                        <Route path="/*" element={<AdministrativePages state={admin} />} />
                    )}
                </Routes>
            </Router>
        )
    }

    return <></>

}
