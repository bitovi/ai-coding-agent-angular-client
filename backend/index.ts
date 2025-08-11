#!/usr/bin/env node
/**
 * AI Coding Agent
 *
 * This is an AI coding agent that runs Claude Code while providing it
 * access tokens for MCP services.
 */
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { mergeParametersWithDefaults } from './public/js/prompt-utils.js';
import { AuthManager } from './src/auth/AuthManager.js';
import { AuthService } from './src/auth/AuthService.js';
import { isServerAuthorized } from './src/auth/authUtils.js';
import { ConfigManager } from './src/config/ConfigManager.js';
import { AuthMiddleware } from './src/middleware/AuthMiddleware.js';
import { PromptManager } from './src/prompts/PromptManager.js';
import { EmailProvider } from './src/providers/EmailProvider.js';
import { ExecutionHistoryProvider } from './src/providers/ExecutionHistoryProvider.js';
import { ClaudeAnthropicSDK } from './src/providers/claude/ClaudeAnthropicSDK.js';
import { ClaudeCodeSDKService } from './src/providers/claude/ClaudeCodeSDKService.js';
import { ClaudeCodeService } from './src/providers/claude/ClaudeCodeService.js';
import { ClaudeServiceProvider } from './src/providers/claude/ClaudeServiceProvider.js';
import { setupAllWebClientRoutes } from './src/services/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AICodingAgent {
  private app: Application;
  private port: number;
  private configManager: ConfigManager;
  private authManager: AuthManager;
  private authService: AuthService;
  private authMiddleware: AuthMiddleware;
  private promptManager: PromptManager;
  private claudeService:
    | ClaudeAnthropicSDK
    | ClaudeCodeService
    | ClaudeCodeSDKService;
  private emailService: EmailProvider;
  private executionHistoryService: ExecutionHistoryProvider;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3100');

    // Initialize services
    this.configManager = new ConfigManager();
    this.authManager = new AuthManager();
    this.promptManager = new PromptManager();
    this.executionHistoryService = new ExecutionHistoryProvider();
    this.claudeService = ClaudeServiceProvider.create(
      this.executionHistoryService
    );
    this.emailService = new EmailProvider();
    this.authService = new AuthService(this.emailService);
    this.authMiddleware = new AuthMiddleware(this.authService as any);
  }

  /**
   * Merge request parameters with default values from prompt schema
   * @deprecated Use shared utility from prompt-utils.js instead
   */
  mergeParametersWithDefaults(prompt: any, requestParameters: any = {}): any {
    return mergeParametersWithDefaults(prompt, requestParameters);
  }

  async initialize(): Promise<void> {
    try {
      // Validate Claude service configuration
      const serviceValidation =
        await ClaudeServiceProvider.validateConfiguration();
      console.log(`🔧 Claude Service: ${serviceValidation.serviceType}`);
      for (const message of serviceValidation.messages) {
        console.log(`   ${message}`);
      }

      if (!serviceValidation.isValid) {
        console.error('❌ Claude service configuration is invalid');
        console.log(
          '\n📖 Please check the documentation for setup instructions:'
        );
        console.log('   https://github.com/your-org/ai-coding-agent/docs');
        process.exit(1);
      }

      // Load configurations
      await this.configManager.loadConfigurations();
      await this.promptManager.loadPrompts();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      console.log('✅ AI Coding Agent initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI Coding Agent:', error);
      process.exit(1);
    }
  }

  setupMiddleware(): void {
    // Request logging middleware for debugging
    this.app.use((req, res, next) => {
      console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
      next();
    });

    // Parse JSON bodies
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Serve static files from public directory (for API documentation, health checks, etc.)
    this.app.use('/static', express.static(path.join(__dirname, 'public')));
  }

  setupRoutes(): void {
    // Legacy routes for backwards compatibility - return JSON responses
    this.app.get('/legacy/prompts/:promptName/activity.html', (req, res) => {
      console.log('🔍 Legacy route hit for:', req.params.promptName);
      res.status(410).json({
        error: 'Legacy UI removed',
        message: 'Please use the Angular frontend instead',
        redirectTo: `/prompts/${req.params.promptName}/activity`,
      });
    });

    this.app.post('/api/auth/request-login', async (req, res) => {
      try {
        console.log('🔐 Login request for:', req.body.email);
        const { email } = req.body;

        if (!email) {
          res.status(400).json({
            error: 'Email required',
            message: 'Please provide an email address',
          });
          return;
        }

        const result = await this.authService.requestMagicLink(email);
        res.json(result);
      } catch (error: any) {
        console.error('❌ Magic link request error:', error);
        res.status(400).json({
          error: 'Login request failed',
          message: error.message,
        });
      }
    });

    this.app.get('/api/auth/login', async (req, res) => {
      try {
        const { token } = req.query;

        if (!token) {
          return res.redirect('/login?error=invalid_token');
        }

        const loginResult = await this.authService.verifyMagicLink(
          token as string
        );

        // Set session cookie
        this.authMiddleware.setSessionCookie(res, loginResult.sessionId);

        // Redirect to dashboard with success message
        res.status(200).json({ message: 'Login successful' });
      } catch (error: any) {
        console.error('❌ Magic link verification error:', error);
        let errorCode = 'invalid_token';
        if (error.message.includes('expired')) {
          errorCode = 'expired_token';
        } else if (error.message.includes('used')) {
          errorCode = 'token_used';
        }

        res.status(400).json({
          error: 'Token validation failed',
          code: errorCode,
          message: error.message,
        });
      }
    });

    this.app.post('/api/auth/logout', (req, res) => {
      const sessionId = this.authMiddleware.getSessionIdFromRequest(req);
      if (sessionId) {
        this.authService.logout(sessionId);
      }

      // Clear session cookie
      this.authMiddleware.clearSessionCookie(res);

      res.json({ success: true, message: 'Logged out successfully' });
    });

    // Legacy prompt activity page (redirect to React route)
    this.app.get('/api/prompts/:promptName/activity.html', (req, res) => {
      res.redirect(`/prompts/${req.params.promptName}/activity`);
    });

    // MCP authorization endpoint
    this.app.post(
      '/api/mcp/:mcpName/authorize',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      async (req, res) => {
        try {
          const mcpName = req.params.mcpName;
          const mcpServer = this.configManager.getMcpServer(mcpName);

          if (!mcpServer) {
            return res.status(404).json({ error: 'MCP server not found' });
          }

          const authUrl =
            await this.authManager.initiateAuthorization(mcpServer);
          res.json({ authUrl });
        } catch (error: any) {
          console.error('❌ Authorization error:', error);
          res.status(500).json({ error: error.message });
        }
      }
    );

    // Environment connections setup endpoint
    this.app.post(
      '/api/connections/git-credentials/setup',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      async (req, res) => {
        try {
          const { token } = req.body;

          if (!token) {
            return res.status(400).json({ error: 'Token is required' });
          }

          await this.setupGitCredentials(token);
          res.json({
            success: true,
            message: 'Git credentials configured successfully',
          });
        } catch (error: any) {
          console.error('❌ Git credentials setup error:', error);
          res.status(500).json({ error: error.message });
        }
      }
    );

    // OAuth callback endpoint
    this.app.get('/api/oauth/callback', async (req, res) => {
      try {
        await this.authManager.handleOAuthCallback(req, res);
      } catch (error: any) {
        console.error('❌ OAuth callback error:', error);
        res.status(500).send('OAuth callback failed');
      }
    });

    // Prompt execution endpoint
    this.app.post(
      '/api/prompt/:promptName/run',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      async (req, res) => {
        try {
          const promptName = req.params.promptName;
          const requestParameters = req.body.parameters || {};

          const prompt = this.promptManager.getPrompt(promptName);
          if (!prompt) {
            return res.status(404).json({ error: 'Prompt not found' });
          }

          // Merge request parameters with defaults from prompt schema
          const parameters = this.mergeParametersWithDefaults(
            prompt,
            requestParameters
          );

          // Check if all required MCP servers are authorized
          const unauthorizedServers: string[] = [];
          for (const mcpServerName of prompt.mcp_servers) {
            const mcpServer = this.configManager.getMcpServer(mcpServerName);

            // Use the new authUtils function that includes custom credential validation
            const isAuthorized = isServerAuthorized(
              mcpServerName,
              mcpServer,
              this.authManager
            );
            if (!isAuthorized) {
              unauthorizedServers.push(mcpServerName);
            }
          }

          if (unauthorizedServers.length > 0) {
            // Save prompt for later execution
            this.promptManager.savePendingPrompt(promptName, parameters);

            // Send email notification
            await this.emailService.sendAuthorizationNeededEmail(
              process.env.EMAIL || '',
              unauthorizedServers
            );

            return res.status(401).json({
              error: 'Authorization required',
              unauthorizedServers,
              message:
                'Please authorize the required MCP servers. An email has been sent with instructions.',
            });
          }

          // Execute the prompt
          const userEmail = (req as any).user?.email || 'unknown';
          await this.claudeService.executePromptStream(
            prompt,
            parameters,
            this.configManager,
            this.authManager,
            res,
            userEmail
          );
        } catch (error: any) {
          console.error('❌ Prompt execution error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: error.message });
          }
        }
      }
    );

    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API documentation endpoint
    this.app.get('/api/docs', (req, res) => {
      res.json({
        name: 'AI Coding Agent API',
        version: '1.0.0',
        description:
          'API-only backend for the AI Coding Agent with Claude integration',
        frontend: 'http://localhost:4201',
        endpoints: {
          system: {
            '/api/system/health': 'System health check',
            '/api/system/status': 'System status and configuration',
            '/api/system/config': 'System configuration',
          },
          authentication: {
            '/api/auth/request-login': 'POST - Request magic link login',
            '/api/auth/login': 'GET - Verify magic link token',
            '/api/auth/logout': 'POST - Logout user',
          },
          prompts: {
            '/api/prompts': 'GET - List all prompts',
            '/api/prompts/:name': 'GET - Get specific prompt',
            '/api/prompt/:name/run': 'POST - Execute a prompt',
          },
          connections: {
            '/api/connections': 'GET - List all connections',
            '/api/connections/git-credentials/setup':
              'POST - Setup git credentials',
            '/api/mcp/:name/authorize': 'POST - Authorize MCP server',
          },
          execution: {
            '/api/executions': 'GET - Get execution history',
            '/api/prompts/:name/activity': 'GET - Get prompt activity',
          },
        },
      });
    });

    // === WEB CLIENT SERVICE ROUTES ===
    // Set up the new modular web client API routes
    const webClientDeps = {
      authService: this.authService,
      authMiddleware: this.authMiddleware,
      promptManager: this.promptManager,
      configManager: this.configManager,
      authManager: this.authManager,
      executionHistoryService: this.executionHistoryService,
      claudeService: this.claudeService,
      emailService: this.emailService,
    };

    // Wire up all the web client service routes (GET /api/user, /api/prompts, etc.)
    setupAllWebClientRoutes(this.app, webClientDeps);

    // Serve the React app for all non-API routes (SPA fallback)
    // This must be the last route to catch all unmatched routes
    this.app.get('*', (req, res) => {
      // Return a JSON response indicating this is an API-only backend
      res.status(404).json({
        error: 'Route not found',
        message:
          'This is an API-only backend. Please use the Angular frontend at http://localhost:4201',
        path: req.path,
        availableRoutes: [
          '/api/*',
          '/api/oauth/*',
          '/api/mcp/*',
          '/api/prompt/*',
          '/api/connections/*',
          '/api/health',
        ],
      });
    });
  }

  /**
   * Setup git credentials for Claude Code operations
   * @param token - GitHub personal access token
   */
  async setupGitCredentials(token: string): Promise<void> {
    const fs = await import('fs');
    const os = await import('os');
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // Determine the appropriate home directory
    const homeDir = process.env.HOME || os.homedir() || '/home/appuser';

    // Create .git-credentials file
    const gitCredentialsPath = path.join(homeDir, '.git-credentials');
    const username = process.env.GIT_USERNAME || 'token';
    const credentialsContent = `https://${username}:${token}@github.com\n`;

    // Write the credentials file
    await fs.promises.writeFile(gitCredentialsPath, credentialsContent, {
      mode: 0o600,
    });

    // Configure git to use the credential store
    await execAsync('git config --global credential.helper store');

    console.log(`✅ Git credentials configured at: ${gitCredentialsPath}`);
    console.log(`✅ Git credential helper configured to use store`);
  }

  async start(): Promise<void> {
    await this.initialize();

    this.app.listen(this.port, () => {
      console.log(
        `🚀 AI Coding Agent API server listening on port ${this.port}`
      );
      console.log(`� API Base URL: http://localhost:${this.port}`);
      console.log(`📋 Angular Frontend: http://localhost:4201`);
      console.log(
        `💡 This backend now serves APIs only - use the Angular frontend for the UI`
      );
    });
  }
}

// Start the application
const agent = new AICodingAgent();
agent.start().catch(console.error);
