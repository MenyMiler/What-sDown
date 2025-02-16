import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Box, CssBaseline } from '@mui/material';
import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import rtlPlugin from 'stylis-plugin-rtl';
import { MainBox, StyledSchoolIcon, StyledYesodotIcon } from './Main.styled';
import { SideBar } from './common/SideBar';
import { PageType } from './common/filterSelect';
import { environment } from './globals';
import { Types as UserTypes } from './interfaces/user';
import HumanResources from './pages/HumanResources';
import { PageTemplate } from './pages/Page';
import { AuthService } from './services/authService';
import { useUserStore } from './stores/user';
import { ProtectActivityLogs, ProtectedRoute, hasPermission } from './utils/ProtectedRoutes';
import Unavailable from './pages/Unavailable';
import FeedbackManagementPage from './pages/FeedbackManagement';

const Home = lazy(() => import('./pages/Home'));
// const Unavailable = lazy(() => import('./pages/Unavailable'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const YearlyGraph = lazy(() => import('./pages/yearlyGraph'));
const ResourceManagement = lazy(() => import('./pages/ResourceManagement'));
const GeneralGantt = lazy(() => import('./pages/GeneralGantt'));
const CoursesGantt = lazy(() => import('./pages/CoursesGantt'));
const BedroomsGantt = lazy(() => import('./pages/BedroomsGantt'));
const RecruitGantt = lazy(() => import('./pages/RecruitGantt'));
const EventsGantt = lazy(() => import('./pages/eventsGantt'));
const RequestManagement = lazy(() => import('./pages/RequestManagement'));
const Resources = lazy(() => import('./pages/Resources'));
const ActivityLog = lazy(() => import('./pages/ActivityLogs'));
const NewEditResources = lazy(() => import('./pages/NewEditResources'));
// const FeedbackManagement = lazy(() => import('./pages/FeedbackManagement'));

export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});

const { permissions } = environment;

const Main = () => {
    const currentUser = useUserStore(({ user }) => user);
    let cleanCookie = 0;

    useEffect(() => localStorage.setItem('baseId', currentUser.baseId || ''), [currentUser.baseId]);

    return (
        <Router>
            <Box display="flex">
                <CssBaseline />
                {currentUser.currentUserType && <SideBar />}
                <CacheProvider value={cacheRtl}>
                    <MainBox>
                        {currentUser.currentUserType && (
                            <>
                                <StyledYesodotIcon
                                    onClick={() => {
                                        if (cleanCookie > 5) AuthService.logout();
                                        else cleanCookie++;
                                    }}
                                />
                                <StyledSchoolIcon />
                            </>
                        )}
                        <Suspense fallback={<div>Loading...</div>}>
                            <Box sx={{ mx: '3rem' }}>
                                <Routes>
                                    <Route path="/unavailable" element={<Unavailable />} />
                                    <Route
                                        path="/graph/annual"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithoutAuthorizedAndSergeant}>
                                                <PageTemplate title="yearlyGraph.title">
                                                    <YearlyGraph />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/resource-management"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.resourceManager}>
                                                <PageTemplate title="resourceManagement.title" autoMargin="2.5rem">
                                                    <ResourceManagement />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/graph/courses"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithoutAuthorizedAndSergeant}>
                                                <PageTemplate title="filterGantt.title">
                                                    <CoursesGantt />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/graph/classes"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithoutPlanning}>
                                                <PageTemplate title="classesGantt.title">
                                                    <GeneralGantt type={PageType.CLASS} />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/graph/offices"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithoutPlanning}>
                                                <PageTemplate title="officesGantt.title">
                                                    <GeneralGantt type={PageType.OFFICE} />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/graph/recruit"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.planning}>
                                                <PageTemplate title="sideBar.courseManagement.recruitGraph">
                                                    <RecruitGantt />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/graph/events"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithoutPlanning}>
                                                <PageTemplate title="sideBar.courseManagement.EventsGraph">
                                                    <EventsGantt />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/graph/bedrooms"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithoutPlanningAndVisitor}>
                                                <PageTemplate title="bedroomsGantt.title">
                                                    <BedroomsGantt />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/requests"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.allWithBasicUser}>
                                                <PageTemplate title="requestsManagement.title">
                                                    <RequestManagement />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/feedbacks"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.superadmin}>
                                                <PageTemplate title="sideBar.feedbackManagement">
                                                    <FeedbackManagementPage />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="course/edit"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.resourceManager}>
                                                <NewEditResources />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="event/edit"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.resourceManager}>
                                                <NewEditResources />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/soldiers/:soldierType/edit"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.authorized}>
                                                <PageTemplate title="editUser.title">
                                                    <HumanResources />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/resources"
                                        element={
                                            <ProtectedRoute allowedUsers={permissions.resourceManager}>
                                                <PageTemplate title="resources.title">
                                                    <Resources />
                                                </PageTemplate>
                                            </ProtectedRoute>
                                        }
                                    />

                                    <Route path="/unauthorized" element={<Unauthorized />} />
                                    <Route
                                        path="/"
                                        element={
                                            hasPermission(Object.values(UserTypes), currentUser) ? <Home /> : <Navigate to="/unauthorized" replace />
                                        }
                                    />
                                    <Route
                                        path="/activityLogs"
                                        element={
                                            <ProtectActivityLogs allowedUsers={permissions.superadmin} isDeveloper={currentUser.isDeveloper!}>
                                                <PageTemplate title="activityLogs.title">
                                                    <ActivityLog />
                                                </PageTemplate>
                                            </ProtectActivityLogs>
                                        }
                                    />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Box>
                        </Suspense>
                    </MainBox>
                </CacheProvider>
            </Box>
        </Router>
    );
};

export default Main;
