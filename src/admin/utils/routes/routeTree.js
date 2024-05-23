import { Route as rootRoute } from '../../routes/__root'
import { Route as UsersImport } from '../../routes/users'
import { Route as TransactionsImport } from '../../routes/transactions'
import { Route as SubscriptionImport } from '../../routes/subscription'
import { Route as SkillsImport } from '../../routes/skills'
import { Route as RequestsImport } from '../../routes/requests'
import { Route as PositionsImport } from '../../routes/positions'
import { Route as LoginImport } from '../../routes/login'
import { Route as LevelsImport } from '../../routes/levels'
import { Route as InventoryImport } from '../../routes/inventory'
import { Route as IntegrationsImport } from '../../routes/integrations'
import { Route as BrandingImport } from '../../routes/branding'
import { Route as BillingImport } from '../../routes/billing'
import { Route as AchievementsImport } from '../../routes/achievements'
import { Route as IndexImport } from '../../routes/index'
import { getRoute } from './getRoute'

const UsersRoute = UsersImport.update({
    path: getRoute('/users'),
    getParentRoute: () => rootRoute,
})

const TransactionsRoute = TransactionsImport.update({
    path: getRoute('/transactions'),
    getParentRoute: () => rootRoute,
})

const SubscriptionRoute = SubscriptionImport.update({
    path: getRoute('/subscription'),
    getParentRoute: () => rootRoute,
})

const SkillsRoute = SkillsImport.update({
    path: getRoute('/skills'),
    getParentRoute: () => rootRoute,
})

const RequestsRoute = RequestsImport.update({
    path: getRoute('/requests'),
    getParentRoute: () => rootRoute,
})

const PositionsRoute = PositionsImport.update({
    path: getRoute('/positions'),
    getParentRoute: () => rootRoute,
})

const LoginRoute = LoginImport.update({
    path: getRoute('/login'),
    getParentRoute: () => rootRoute,
})

const LevelsRoute = LevelsImport.update({
    path: getRoute('/levels'),
    getParentRoute: () => rootRoute,
})

const InventoryRoute = InventoryImport.update({
    path: getRoute('/inventory'),
    getParentRoute: () => rootRoute,
})

const IntegrationsRoute = IntegrationsImport.update({
    path: getRoute('/integrations'),
    getParentRoute: () => rootRoute,
})

const BrandingRoute = BrandingImport.update({
    path: getRoute('/branding'),
    getParentRoute: () => rootRoute,
})

const BillingRoute = BillingImport.update({
    path: getRoute('/billing'),
    getParentRoute: () => rootRoute,
})

const AchievementsRoute = AchievementsImport.update({
    path: getRoute('/achievements'),
    getParentRoute: () => rootRoute,
})

const IndexRoute = IndexImport.update({
    path: getRoute('/'),
    getParentRoute: () => rootRoute,
})


export const routeTree = rootRoute.addChildren([
    IndexRoute,
    AchievementsRoute,
    BillingRoute,
    BrandingRoute,
    IntegrationsRoute,
    InventoryRoute,
    LevelsRoute,
    LoginRoute,
    PositionsRoute,
    RequestsRoute,
    SkillsRoute,
    SubscriptionRoute,
    TransactionsRoute,
    UsersRoute,
])
