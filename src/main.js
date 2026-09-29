/**
 * Application Entry Point
 * Wires router, global state, stylesheets, time tracking, and initializes app mounting.
 */

import './styles/main.css';

import { router } from './app/router.js';
import { store } from './app/state.js';
import { createApp } from './app/App.js';
import { startTimeTracker } from './modules/analytics/timeTracker.js';
import { logEvent } from './modules/analytics/eventLogger.js';

// Import Pages
import { createLandingPage } from './pages/LandingPage.js';
import { createIdentityPage } from './pages/IdentityPage.js';
import { createOnboardingPage } from './pages/OnboardingPage.js';
import { createDashboardPage } from './pages/DashboardPage.js';
import { createLearningPathPage } from './pages/LearningPathPage.js';
import { createMeetingPage } from './pages/MeetingPage.js';
import { createPreTestPage } from './pages/PreTestPage.js';
import { createPostTestPage } from './pages/PostTestPage.js';
import { createCompletionPage } from './pages/CompletionPage.js';
import { createProgressPage } from './pages/ProgressPage.js';
import { createSettingsPage } from './pages/SettingsPage.js';
import { createResearchModePage } from './pages/ResearchModePage.js';
import { createCtfLibraryPage } from './pages/CtfLibraryPage.js';
import { createCtfInvestigationPage } from './pages/CtfInvestigationPage.js';
import { createLeaderboardPage } from './pages/LeaderboardPage.js';
import { createProfilePage } from './pages/ProfilePage.js';
import { createReviewPage } from './pages/ReviewPage.js';
import { createBookmarksPage } from './pages/BookmarksPage.js';

// Import Admin Pages
import { createAdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { createAdminOverviewPage } from './pages/admin/AdminOverviewPage.js';
import { createAdminStudentsPage } from './pages/admin/AdminStudentsPage.js';
import { createAdminQuestionsPage } from './pages/admin/AdminQuestionsPage.js';
import { createAdminCtfPage } from './pages/admin/AdminCtfPage.js';
import { createAdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage.js';
import { createAdminResearchPage } from './pages/admin/AdminResearchPage.js';
import { createAdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage.js';

function init() {
  // Apply saved theme
  const currentTheme = store.getState().settings?.theme || 'system';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Mount root app
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('Root container #app not found in document.');
    return;
  }

  const appElement = createApp();
  appContainer.appendChild(appElement);

  // Register Student Routes
  router.register('/', createLandingPage);
  router.register('/identity', createIdentityPage);
  router.register('/onboarding', createOnboardingPage);
  router.register('/dashboard', createDashboardPage);
  router.register('/learning-path', createLearningPathPage);
  router.register('/meeting/:id', createMeetingPage);
  router.register('/ctf', createCtfLibraryPage);
  router.register('/ctf/:id', createCtfInvestigationPage);
  router.register('/leaderboard', createLeaderboardPage);
  router.register('/profile', createProfilePage);
  router.register('/review', createReviewPage);
  router.register('/portfolio', createReviewPage);
  router.register('/bookmarks', createBookmarksPage);
  router.register('/evidence', createBookmarksPage);
  router.register('/pre-test', createPreTestPage);
  router.register('/post-test', createPostTestPage);
  router.register('/completion', createCompletionPage);
  router.register('/progress', createProgressPage);
  router.register('/metrics', createProgressPage);
  router.register('/settings', createSettingsPage);
  router.register('/research', createResearchModePage);

  // Register Admin Routes
  router.register('/admin/login', createAdminLoginPage);
  router.register('/admin', createAdminOverviewPage);
  router.register('/admin/students', createAdminStudentsPage);
  router.register('/admin/questions', createAdminQuestionsPage);
  router.register('/admin/ctf', createAdminCtfPage);
  router.register('/admin/analytics', createAdminAnalyticsPage);
  router.register('/admin/research', createAdminResearchPage);
  router.register('/admin/audit-logs', createAdminAuditLogsPage);

  // Start passive research telemetry
  startTimeTracker();
  logEvent('app_started', {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });

  // Start router navigation
  router.init();
}

// Boot application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
