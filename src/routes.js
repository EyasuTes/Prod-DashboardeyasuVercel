import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'))
const Dashboard_backup = React.lazy(() => import('./views/Dashboard/Dashboard_backup'))
const DashboardLiveStock = React.lazy(() => import('./views/Dashboard/DashboardLiveStock'))
const AddAnimals = React.lazy(() => import('./views/LivestockManagenment/AddAnimals'))
const AnimalsList = React.lazy(() => import('./views/LivestockManagenment/AnimalsList'))
const AddFromSheet = React.lazy(() => import('./views/LivestockManagenment/AddFromSheet'))
const AnimalListByBirthYear = React.lazy(() =>
  import('./views/LivestockManagenment/AnimalListByBirthYear'),
)
const AddHealthCheckup = React.lazy(() => import('./views/HealthManagenment/AddHealthCheckup'))
const AddFromSheetHealth = React.lazy(() => import('./views/HealthManagenment/AddFromSheet'))
const LeaveRequest = React.lazy(() => import('./views/WorkersManagement/LeaveRequest'))
const MissedPunchs = React.lazy(() => import('./views/WorkersManagement/MissedPunchs'))
const WorkersActivity = React.lazy(() => import('./views/WorkersManagement/WorkersActivity'))
const Departments = React.lazy(() => import('./views/WorkersManagement/DepartmentsList'))
const publicHolidays = React.lazy(() => import('./views/WorkersManagement/publicHolidaysList'))
const ActivityDetails = React.lazy(() => import('./views/WorkersManagement/WorkersActivityDetails'))
const WorkesLogs = React.lazy(() => import('./views/WorkersManagement/WorkersLogs'))
const WorkersAttendance = React.lazy(() => import('./views/WorkersManagement/WorkersAttendance'))
const WorkersList = React.lazy(() => import('./views/WorkersManagement/WorkersList'))
const GeoFencingList = React.lazy(() => import('./views/GeoFencingManagement/GeoFencingList'))
const NotificationsList = React.lazy(() => import('./views/WorkersManagement/NotificationsList'))
const AnimalLogs = React.lazy(() => import('./views/LivestockManagenment/AnimalsLogs'))
const DefaultGeoFencingList = React.lazy(() =>
  import('./views/GeoFencingManagement/DefaultGeoFencingList'),
)
const DefineLocation = React.lazy(() => import('./views/GeoFencingManagement/DefineLocation'))
const RequestGeoFencing = React.lazy(() => import('./views/GeoFencingManagement/RequestGeoFencing'))
const ProfileManagement = React.lazy(() => import('./views/Profile/ProfileManagement'))
const CertificateRequest = React.lazy(() => import('./views/InventoryManage/CertificateRequest'))
const VendorProduct = React.lazy(() => import('./views/InventoryManage/VendorProductApproval'))
const QualityTest = React.lazy(() => import('./views/InventoryManage/QualityTest'))
const Inventory = React.lazy(() => import('./views/InventoryManage/Inventory'))
const InventoryCategory = React.lazy(() => import('./views/InventoryManage/InventoryCategory'))

const UploadActivity = React.lazy(() => import('./views/ResearchersManagement/UploadActivity'))
// const MyActivity = React.lazy(() => import('./views/ResearchersManagement/MyActivity'))
const AddVendor = React.lazy(() => import('./views/VendorManagement/AddVendor'))
const ManageVendor = React.lazy(() => import('./views/VendorManagement/ManageVendor'))
const AddProduct = React.lazy(() => import('./views/VendorManagement/AddProduct'))
const ManageProducts = React.lazy(() => import('./views/VendorManagement/ManageProducts'))
const ManageProductsCategory = React.lazy(() => import('./views/InventoryManage/ProductCategory'))
const SignUpList = React.lazy(() => import('./views/UserRolesPermissions/SignUpList'))
const OrganizationalChart = React.lazy(() =>
  import('./views/UserRolesPermissions/OrganizationalChart'),
)
const DeleteAccountRequest = React.lazy(() =>
  import('./views/UserRolesPermissions/DeleteAccountRequest'),
)
const ManageProductsUOM = React.lazy(() => import('./views/InventoryManage/ProductUOM'))
const RolesPermissions = React.lazy(() => import('./views/UserRolesPermissions/RolesPermissions'))

const AnimalsActivityList = React.lazy(() => import('./views/LivestockManagenment/ActivityList'))
const SchedulingList = React.lazy(() => import('./views/Scheduling/List'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/organizational-chart', name: 'Dashboard', element: OrganizationalChart },
  { path: '/Sign-Up-List', name: 'Dashboard', element: SignUpList },
  { path: '/Delete-Account-Request', name: 'Dashboard', element: DeleteAccountRequest },
  { path: '/Dashboard_backup', name: 'Dashboard', element: Dashboard_backup },
  { path: '/DashboardLiveStock', name: 'Dashboard', element: DashboardLiveStock },
  { path: '/workers-notifications', name: 'Dashboard', element: NotificationsList },
  { path: '/animal-logs', name: 'Dashboard', element: AnimalLogs },
  { path: '/manage-departments', name: 'Dashboard', element: Departments },
  { path: '/manage-public-holidays', name: 'Dashboard', element: publicHolidays },
  { path: '/add-animals', name: 'AddAnimals', element: AddAnimals },
  { path: '/animals-list', name: 'AnimalsList', element: AnimalsList },
  { path: '/animals-list-birthYear', name: 'AnimalsList', element: AnimalListByBirthYear },
  { path: '/animals-activities', name: 'AnimalsList', element: AnimalsActivityList },
  { path: '/scheduling', name: 'AnimalsList', element: SchedulingList },
  { path: '/add-from-sheet', name: 'AddFromSheet', element: AddFromSheet },
  { path: '/add-health-checkup', name: 'AddHealthCheckup', element: AddHealthCheckup },
  { path: '/add-from-sheet-health', name: 'AddFromSheetHealth', element: AddFromSheetHealth },
  { path: '/workers-leave-request', name: 'LeaveRequest', element: LeaveRequest },
  { path: '/workers-missed-punchs', name: 'MissedPunchIN', element: MissedPunchs },
  { path: '/workers-attendance', name: 'WorkersActivity', element: WorkersAttendance },
  { path: '/workers-activity', name: 'WorkersActivity', element: WorkersActivity },
  { path: '/workers-activity-details', name: 'ActivityDetails', element: ActivityDetails },
  { path: '/workers-login-log', name: 'ActivityDetails', element: WorkesLogs },
  { path: '/workers-list', name: 'WorkersList', element: WorkersList },
  { path: '/geo-fencing-list', name: 'GeoFencingList', element: GeoFencingList },
  { path: '/geo-fencing-default', name: 'GeoFencingList', element: DefaultGeoFencingList },
  { path: '/define-location', name: 'DefineLocation', element: DefineLocation },
  { path: '/requested-geo-fencing', name: 'RequestGeoFencing', element: RequestGeoFencing },
  { path: '/profile-management', name: 'ProfileManagement', element: ProfileManagement },
  { path: '/certificate-request', name: 'CertificateRequest', element: CertificateRequest },
  { path: '/vendor-product-approval', name: 'VendorProduct', element: VendorProduct },
  { path: '/quality-test', name: 'QualityTest', element: QualityTest },
  { path: '/inventory-list', name: 'Inventory', element: Inventory },
  { path: '/inventory', name: 'Inventory', element: InventoryCategory },
  { path: '/upload-activity', name: 'UploadActivity', element: UploadActivity },
  // { path: '/my-activity', name: 'MyActivity', element: MyActivity },
  { path: '/add-vendor', name: 'AddVendor', element: AddVendor },
  { path: '/manage-vendor', name: 'ManageVendor', element: ManageVendor },
  { path: '/add-product', name: 'AddProduct', element: AddProduct },
  { path: '/manage-products', name: 'ManageProducts', element: ManageProducts },
  { path: '/manage-products-category', name: 'ManageProducts', element: ManageProductsCategory },
  { path: '/manage-products-uom', name: 'ManageProducts', element: ManageProductsUOM },
  { path: '/user-roles-and-permissions', name: 'RolesPermissions', element: RolesPermissions },
]

export default routes
