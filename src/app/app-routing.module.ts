import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ErrorResolverComponent, PageComponent, PageModule } from '@sunbird-cb/collection'
import { ExploreDetailResolve, PageResolve } from '@sunbird-cb/utils'
// import { LearningGuard } from '../../project/ws/app/src/lib/routes/my-learning/guards/my-learning.guard'
import { InvalidUserComponent } from './component/invalid-user/invalid-user.component'
import { LoginRootComponent } from './component/login-root/login-root.component'
// import { ETopBar } from './constants/topBar.constants'
import { EmptyRouteGuard } from './guards/empty-route.guard'
import { ExternalUrlResolverService } from './guards/external-url-resolver.service'
import { GeneralGuard } from './guards/general.guard'
import { LoginGuard } from './guards/login.guard'
import { FeaturesComponent } from './routes/features/features.component'
import { FeaturesModule } from './routes/features/features.module'
import { MobileAppHomeComponent } from './routes/public/mobile-app/components/mobile-app-home.component'
import { PublicAboutComponent } from './routes/public/public-about/public-about.component'
import { PublicContactComponent } from './routes/public/public-contact/public-contact.component'
import { PublicFaqComponent } from './routes/public/public-faq/public-faq.component'
import { TncComponent } from './routes/tnc/tnc.component'
import { TncAppResolverService } from './services/tnc-app-resolver.service'
import { TncPublicResolverService } from './services/tnc-public-resolver.service'
import { PublicLogoutComponent } from './routes/public/public-logout/public-logout.component'
// import { AppTocResolverService } from '@ws/app/src/lib/routes/app-toc/resolvers/app-toc-resolver.service'

// 💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
// Please declare routes in alphabetical order
// 😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [EmptyRouteGuard],
    component: LoginRootComponent,
  },
  { path: 'practice/behavioral',
    pathMatch: 'full',
    redirectTo: 'page/embed-behavioural-skills' },
  {
    path: 'app/home',
    loadChildren: () => import('./routes/route-home.module').then(u => u.RouteHomeAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'home',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/training-plan',
    loadChildren: () => import('./routes/route-training-plan.module').then(u => u.RouteTrainingPlanAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      // pageKey: 'training-plan-home',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/roles',
    loadChildren: () => import('./routes/route-roles-access.module').then(u => u.RouteAccessAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'roles-access',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/approvals',
    loadChildren: () => import('./routes/route-approvals.module').then(u => u.RouteApprovalsAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'approvals',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/users',
    loadChildren: () => import('./routes/route-users.module').then(u => u.RouteUsersAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'users',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/events',
    loadChildren: () => import('./routes/route-events.module').then(u => u.RouteEventsAppModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'events',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/frac',
    loadChildren: () => import('./routes/route-frac.module').then(u => u.RouteFracModule),
    canActivate: [GeneralGuard],
  },
  // {
  //   path: 'app/setup',
  //   loadChildren: () => import('./routes/route-app-setup.module').then(u => u.RouteAppSetupModule),
  // },
  {
    path: 'app/features',
    component: FeaturesComponent,
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/info',
    loadChildren: () => import('./routes/route-info-app.module').then(u => u.RouteInfoAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/invalid-user',
    component: InvalidUserComponent,
    data: {
      pageType: 'feature',
      pageKey: 'invalid-user',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/my-dashboard',
    loadChildren: () =>
      import('./routes/route-my-dashboard.module').then(u => u.RouteMyDashboardModule),
    // canActivate: [GeneralGuard, LearningGuard],
  },
  {
    path: 'app/notifications',
    loadChildren: () =>
      import('./routes/route-notification-app.module').then(u => u.RouteNotificationAppModule),
    canActivate: [GeneralGuard],
  },
  // {
  //   path: 'app/person-profile',
  //   loadChildren: () =>
  //     import('./routes/route-profile-v2.module').then(u => u.RouteProfileV2Module),
  //   canActivate: [GeneralGuard],
  //   data: {
  //     pageType: 'feature',
  //     pageKey: 'profile-v2',
  //   },
  //   resolve: {
  //     pageData: PageResolve,
  //   },
  // },
  {
    path: 'app/events',
    loadChildren: () => import('./routes/route-app-event.module').then(m => m.AppEventsModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/search',
    loadChildren: () =>
      import('./routes/route-search-app.module').then(u => u.RouteSearchAppModule),
    data: {
      pageType: 'feature',
      pageKey: 'search',
    },
    resolve: {
      searchPageData: PageResolve,
    },
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/signup',
    loadChildren: () =>
      import('./routes/signup/signup.module').then(u => u.SignupModule),
  },
  {
    path: 'app/auto-signup/:id',
    loadChildren: () =>
      import('./routes/signup-auto/signup-auto.module').then(u => u.SignupAutoModule),
  },
  {
    path: 'app/tnc',
    component: TncComponent,
    resolve: {
      tnc: TncAppResolverService,
    },
  },
  {
    path: 'app/blended-approvals',
    loadChildren: () => import('./routes/route-blended-approvals.module').then(u => u.RouteBlendedApprovalsModule),
    canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'blended-approvals',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'error-access-forbidden',
    component: ErrorResolverComponent,
    data: {
      errorType: 'accessForbidden',
    },
  },
  {
    path: 'error-content-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'contentUnavailable',
    },
  },
  {
    path: 'error-feature-disabled',
    component: ErrorResolverComponent,
    data: {
      errorType: 'featureDisabled',
    },
  },
  {
    path: 'error-feature-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'featureUnavailable',
    },
  },
  {
    path: 'error-internal-server',
    component: ErrorResolverComponent,
    data: {
      errorType: 'internalServer',
    },
  },
  {
    path: 'error-service-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'serviceUnavailable',
    },
  },
  {
    path: 'error-somethings-wrong',
    component: ErrorResolverComponent,
    data: {
      errorType: 'somethingsWrong',
    },
  },
  {
    path: 'externalRedirect',
    canActivate: [ExternalUrlResolverService],
    component: ErrorResolverComponent,
  },
  { path: 'home', redirectTo: 'app/home', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginRootComponent,
    data: {
      pageType: 'feature',
      pageKey: 'login',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  { path: 'network', redirectTo: 'page/network', pathMatch: 'full' },
  {
    path: 'page/toc',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: 'page/:id',
    component: PageComponent,
    data: {
      pageType: 'page',
      pageKey: 'id',
    },
    resolve: {
      pageData: PageResolve,
    },
    canActivate: [GeneralGuard],
  },
  {
    path: 'page/explore/:tags',
    data: {
      pageType: 'page',
      pageKey: 'catalog-details',
    },
    resolve: {
      pageData: ExploreDetailResolve,
    },
    component: PageComponent,
    canActivate: [GeneralGuard],
  },
  {
    path: 'public/about',
    component: PublicAboutComponent,
    data: {
      pageType: 'feature',
      pageKey: 'about',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/contact',
    component: PublicContactComponent,
    data: {
      pageType: 'feature',
      pageKey: 'public-faq',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/logout',
    component: PublicLogoutComponent,
  },
  {
    path: 'public/mobile-app',
    component: MobileAppHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'mobile-app',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/tnc',
    component: TncComponent,
    data: {
      isPublic: true,
    },
    resolve: {
      tnc: TncPublicResolverService,
    },
  },
  {
    path: 'public/faq/:tab',
    component: PublicFaqComponent,
  },
  {
    path: 'app/workallocation',
    loadChildren: () => import('./routes/route-workallocation-v2.module').then(u => u.RouteWorkAllocationV2Module),
    canActivate: [GeneralGuard],
    data: {
      requiredRoles: [],
      pageType: 'feature',
      pageKey: 'workallocation',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/setup',
    loadChildren: () =>
      import('./routes/route-state-profile.module').then(u => u.RouteStateProfileModule),
    // canActivate: [GeneralGuard],
    data: {
      pageType: 'feature',
      pageKey: 'state-profile',
      pageId: 'app/state-profile',
      module: 'state-profile',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: '**',
    component: ErrorResolverComponent,
    data: {
      errorType: 'notFound',
    },
  },
]
@NgModule({
  imports: [
    PageModule,
    FeaturesModule,
    RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'top',
    urlUpdateStrategy: 'eager',
    onSameUrlNavigation: 'reload',
    scrollOffset: [0, 80],
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
  providers: [ExploreDetailResolve],
})
export class AppRoutingModule { }
