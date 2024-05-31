import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'employee-list',
    loadChildren: () => import('./pages/employee-list/employee-list.module').then(m => m.EmployeeListPageModule)
  },
  {
    path: 'user-groups',
    loadChildren: () => import('./pages/user-groups/user-groups.module').then(m => m.UserGroupsPageModule)
  },
  {
    path: 'teams',
    loadChildren: () => import('./pages/teams/teams.module').then(m => m.TeamsPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksPageModule)
  },
  {
    path: 'projects',
    loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsPageModule)
  },
  {
    path: 'dsr',
    loadChildren: () => import('./pages/dsr/dsr.module').then(m => m.DsrPageModule)
  },
  {
    path: 'project-details/:id',
    loadChildren: () => import('./pages/project-details/project-details.module').then(m => m.ProjectDetailsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./pages/attendance/attendance.module').then(m => m.AttendancePageModule)
  },
  {
    path: 'salary',
    loadChildren: () => import('./pages/salary/salary.module').then(m => m.SalaryPageModule)
  },
  {
    path: 'employee-onboarding/:id',
    loadChildren: () => import('./pages/employee-onboarding/employee-onboarding.module').then(m => m.EmployeeOnboardingPageModule)
  },
  {
    path: 'project-manage/:id',
    loadChildren: () => import('./pages/project-manage/project-manage.module').then(m => m.ProjectManagePageModule)
  },
  {
    path: 'leaves',
    loadChildren: () => import('./pages/leaves/leaves.module').then(m => m.LeavesPageModule)
  },
  {
    path: 'expenses',
    loadChildren: () => import('./pages/expenses/expenses.module').then(m => m.ExpensesPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'dsr-monthly-preview',
    loadChildren: () => import('./pages/dsr-monthly-preview/dsr-monthly-preview.module').then(m => m.DsrMonthlyPreviewPageModule)
  },
  {
    path: 'view-all-dsr',
    loadChildren: () => import('./pages/view-all-dsr/view-all-dsr.module').then(m => m.ViewAllDsrPageModule)
  },
  {
    path: 'employee-profile',
    loadChildren: () => import('./pages/employee-profile/employee-profile.module').then(m => m.EmployeeProfilePageModule)
  },
  {
    path: 'project-task-details',
    loadChildren: () => import('./modals/project-task-details/project-task-details.module').then(m => m.ProjectTaskDetailsPageModule)
  },
  {
    path: 'project-epic-details',
    loadChildren: () => import('./modals/project-epic-details/project-epic-details.module').then(m => m.ProjectEpicDetailsPageModule)
  },
  {
    path: 'project-story-details',
    loadChildren: () => import('./modals/project-story-details/project-story-details.module').then(m => m.ProjectStoryDetailsPageModule)
  },
  {
    path: 'new-post',
    loadChildren: () => import('./pages/new-post/new-post.module').then(m => m.NewPostPageModule)
  },
  {
    path: 'organization-structure',
    loadChildren: () => import('./pages/organization-structure/organization-structure.module').then(m => m.OrganizationStructurePageModule)
  },
  {
    path: 'performance',
    loadChildren: () => import('./pages/performance/performance.module').then(m => m.PerformancePageModule)
  },
  {
    path: 'view-all-kra',
    loadChildren: () => import('./pages/view-all-kra/view-all-kra.module').then(m => m.ViewAllKraPageModule)
  },
  {
    path: 'add-kra',
    loadChildren: () => import('./pages/add-kra/add-kra.module').then(m => m.AddKraPageModule)
  },
  {
    path: 'edit-kra',
    loadChildren: () => import('./pages/edit-kra/edit-kra.module').then(m => m.EditKraPageModule)
  },
  {
    path: 'add-note',
    loadChildren: () => import('./modals/add-note/add-note.module').then(m => m.AddNotePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./modals/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'project-sprint-details',
    loadChildren: () => import('./modals/project-sprint-details/project-sprint-details.module').then(m => m.ProjectSprintDetailsPageModule)
  },
  {
    path: 'client-dashboard',
    loadChildren: () => import('./pages/client-dashboard/client-dashboard.module').then(m => m.ClientDashboardPageModule)
  },

  {
    path: 'client-project-details/:id',
    loadChildren: () => import('./pages/client-project-details/client-project-details.module').then(m => m.ClientProjectDetailsPageModule)
  },
  {
    path: 'sales/customers',
    loadChildren: () => import('./pages/sales/customers/customers.module').then(m => m.CustomersPageModule)
  },
  {
    path: 'customers-details',
    loadChildren: () => import('./pages/sales/customers-details/customers-details.module').then(m => m.CustomersDetailsPageModule)
  },
  {
    path: 'view-all-leave',
    loadChildren: () => import('./pages/view-all-leave/view-all-leave.module').then(m => m.ViewAllLeavePageModule)
  },
  {
    path: 'chatrooms',
    loadChildren: () => import('./pages/chatrooms/chatrooms.module').then(m => m.ChatroomsPageModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then(m => m.InventoryPageModule)
  },
  {
    path: 'add-inventory',
    loadChildren: () => import('./pages/inventory/add-inventory/add-inventory.module').then(m => m.AddInventoryPageModule)
  },
  {
    path: 'assign-inventory-item',
    loadChildren: () => import('./modals/assign-inventory-item/assign-inventory-item.module').then(m => m.AssignInventoryItemPageModule)
  },
  {
    path: 'ats',
    loadChildren: () => import('./pages/ats/ats.module').then(m => m.AtsPageModule)
  },
  {
    path: 'add-cv',
    loadChildren: () => import('./pages/ats/add-cv/add-cv.module').then(m => m.AddCVPageModule)
  },
  {
    path: 'user-attendance',
    loadChildren: () => import('./pages/attendance/user-attendance/user-attendance.module').then(m => m.UserAttendancePageModule)
  },
  {
    path: 'project-chart-list',
    loadChildren: () => import('./modals/project-chart-list/project-chart-list.module').then(m => m.ProjectChartListPageModule)
  },
  {
    path: 'project-type-list',
    loadChildren: () => import('./modals/project-type-list/project-type-list.module').then(m => m.ProjectTypeListPageModule)
  },
  {
    path: 'all-user-leave-admin',
    loadChildren: () => import('./pages/all-user-leave-admin/all-user-leave-admin.module').then(m => m.AllUserLeaveAdminPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./pages/tickets/tickets.module').then(m => m.TicketsPageModule)
  },
  {
    path: 'raised-ticket',
    loadChildren: () => import('./modals/raised-ticket/raised-ticket.module').then(m => m.RaisedTicketPageModule)
  },
  {
    path: 'view-log',
    loadChildren: () => import('./pages/view-log/view-log.module').then(m => m.ViewLogPageModule)
  },
  {
    path: 'conveyance',
    loadChildren: () => import('./pages/conveyance/conveyance.module').then(m => m.ConveyancePageModule)
  },
  {
    path: 'create-conveyance',
    loadChildren: () => import('./modals/create-conveyance/create-conveyance.module').then(m => m.CreateConveyancePageModule)
  },
  {
    path: 'pmo/monthlyconsting',
    loadChildren: () => import('./pages/pmo/monthlyconsting/monthlyconsting.module').then(m => m.MonthlyconstingPageModule)
  },
  {
    path: 'pmo/capacity',
    loadChildren: () => import('./pages/pmo/capacity/capacity.module').then(m => m.CapacityPageModule)
  },
  {
    path: 'leadgenerate',
    loadChildren: () => import('./pages/leadgenerate/leadgenerate.module').then(m => m.LeadgeneratePageModule)
  },


  {
    path: 'holidays',
    loadChildren: () => import('./pages/holidays/holidays.module').then(m => m.HolidaysPageModule)
  },
  {
    path: 'createform',
    loadChildren: () => import('./pages/createform/createform.module').then(m => m.CreateformPageModule)
  },
  {
    path: 'employee-evaluation',
    loadChildren: () => import('./pages/employee-evaluation/employee-evaluation.module').then(m => m.EmployeeEvaluationPageModule)
  },
  {
    path: 'manager',
    loadChildren: () => import('./pages/manager/manager.module').then(m => m.ManagerPageModule)
  },
  {
    path: 'reviewform/:id',
    loadChildren: () => import('./pages/reviewform/reviewform.module').then(m => m.ReviewformPageModule)
  },
  {
    path: 'manager-review/:id',
    loadChildren: () => import('./pages/manager-review/manager-review.module').then(m => m.ManagerReviewPageModule)
  },
  {
    path: 'appraisal-hr-screen',
    loadChildren: () => import('./pages/appraisal/appraisal-hr-screen/appraisal-hr-screen.module').then(m => m.AppraisalHrScreenPageModule)
  },
  {
    path: 'workflow-setup',
    loadChildren: () => import('./pages/appraisal/workflow-setup/workflow-setup.module').then(m => m.WorkflowSetupPageModule)
  },
  {
    path: 'approval-screen',
    loadChildren: () => import('./pages/appraisal/approval-screen/approval-screen.module').then(m => m.ApprovalScreenPageModule)
  },
  {
    path: 'amount-setup',
    loadChildren: () => import('./pages/appraisal/amount-setup/amount-setup.module').then(m => m.AmountSetupPageModule)
  },
  {
    path: 'initiate-appraisal',
    loadChildren: () => import('./pages/appraisal/initiate-appraisal/initiate-appraisal.module').then(m => m.InitiateAppraisalPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'asset',
    loadChildren: () => import("./pages/fixed-asset/asset-routing.module").then(m => m.AssetPageRoutingModule)
  },
  {
    path: 'grn',
    loadChildren: () => import('./pages/grn/grn.module').then(m => m.GrnPageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
