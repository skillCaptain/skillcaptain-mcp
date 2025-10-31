import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const API_BASE = "https://skillcaptain.app/unicorn/api";
let authToken: string | null = null;
let userId: string | null = null;

interface LoginResponse {
  success: boolean;
  user_id: string;
}

async function login(email: string, password: string): Promise<LoginResponse> {
  const url = `${API_BASE}/user/login_user`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${await response.text()}`);
  }

  // Extract cookies from Set-Cookie header
  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(",").map((c) => c.trim());
    cookies.forEach((cookie) => {
      if (cookie.startsWith("authentication=")) {
        authToken = cookie.split(";")[0].split("=")[1];
      }
      if (cookie.startsWith("user_id=")) {
        userId = cookie.split(";")[0].split("=")[1];
      }
    });
  }

  if (!authToken || !userId) {
    throw new Error("Missing authentication cookies");
  }

  return { success: true, user_id: userId };
}

async function listTodo(): Promise<any> {
  if (!authToken || !userId) {
    throw new Error("Not logged in. Run the 'login' tool first.");
  }

  const url = `${API_BASE}/todo/get-progress-tracker/${userId}`;
  const response = await fetch(url, {
    headers: {
      authentication: authToken,
      user_id: userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching tracker: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function listCourses(providedUserId?: string): Promise<any> {
  const url = "https://skillcaptain.app/unicorn/courses";
  const effectiveUserId = providedUserId || userId;

  const params = new URLSearchParams();
  if (effectiveUserId) {
    params.append("userId", effectiveUserId);
  }

  const headers: Record<string, string> = {};
  if (authToken && userId) {
    headers.authentication = authToken;
    headers.user_id = userId;
  }

  const response = await fetch(`${url}?${params}`, { headers });

  if (!response.ok) {
    throw new Error(`Error fetching courses: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function getCourseDetails(courseId: string): Promise<any> {
  if (!authToken || !userId) {
    throw new Error("Not logged in. Run the 'login' tool first.");
  }

  const url = `${API_BASE}/goal/course/${courseId}`;
  const response = await fetch(url, {
    headers: {
      authentication: authToken,
      user_id: userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching course details: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function getAssignmentDetails(courseId: string, goalId: string): Promise<any> {
  if (!authToken || !userId) {
    throw new Error("Not logged in. Run the 'login' tool first.");
  }

  const courseData = await getCourseDetails(courseId);
  const assignments = courseData.assignments || {};
  const goalIdStr = String(goalId);

  if (!assignments[goalIdStr]) {
    throw new Error(`Assignment not found for goal_id: ${goalId}`);
  }

  const assignment = assignments[goalIdStr];
  const goals = courseData.goals || [];
  const goalData = goals.find((g: any) => String(g.id) === goalIdStr);
  const resources = (courseData.resources || {})[goalIdStr] || [];
  const progress = (courseData.goal_id_of_completed_assignment || {})[goalIdStr] || "Not Started";

  return {
    assignment,
    assignment_id: assignment.id,
    concept: goalData,
    resources,
    progress_status: progress,
    course_info: {
      course_id: courseData.course_id,
      course_title: courseData.course_dto?.title,
      completion_percentage: courseData.completion_percentage,
      default_ide_language: courseData.default_ide_language,
    },
  };
}

async function submitCode(
  code: string,
  goalId: string,
  assignmentId: string,
  courseId: string,
  language: string = "java"
): Promise<any> {
  if (!authToken || !userId) {
    throw new Error("Not logged in. Run the 'login' tool first.");
  }

  const url = `${API_BASE}/ide/v2/submit`;
  const payload = {
    code,
    goalId: String(goalId),
    assignmentId: String(assignmentId),
    courseId: String(courseId),
    language,
  };

  console.log(`Submitting code - URL: ${url}`);
  console.log(`Payload: goalId=${goalId}, assignmentId=${assignmentId}, courseId=${courseId}, language=${language}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      user_id: userId,
      assignment: String(assignmentId),
      Cookie: `authentication=${authToken}; user_id=${userId}`,
    },
    body: JSON.stringify(payload),
  });

  console.log(`Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`Response: ${errorText}`);
    throw new Error(`Error submitting code: ${response.status} ${errorText}`);
  }

  return response.json();
}

// Create MCP server
const server = new Server(
  {
    name: "skillcaptain-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "login",
        description: "Authenticate to SkillCaptain with email and password",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "Account email",
            },
            password: {
              type: "string",
              description: "Account password",
            },
          },
          required: ["email", "password"],
        },
      },
      {
        name: "list-todo",
        description: "List SkillCaptain TODO progress tracker",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list-courses",
        description: "List all SkillCaptain courses. If logged in, uses your userId unless one is provided.",
        inputSchema: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "Optional userId to fetch courses for",
            },
          },
        },
      },
      {
        name: "get-course-details",
        description: "Get detailed information about a specific course including concepts, assignments, progress, and resources. Requires login.",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "The course ID to fetch details for",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get-assignment-details",
        description: "Get detailed assignment/problem information for a specific topic or concept in a course. Returns assignment, concept details, resources, and progress status. Requires login.",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "The course ID",
            },
            goal_id: {
              type: "string",
              description: "The goal ID (topic/concept ID) to get the assignment for",
            },
          },
          required: ["course_id", "goal_id"],
        },
      },
      {
        name: "submit-code",
        description: "Submit code for evaluation and receive automated feedback, review, execution results, and code quality assessment. Requires login.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The code to submit for evaluation",
            },
            goal_id: {
              type: "string",
              description: "The goal ID (topic/concept ID) this code is for",
            },
            assignment_id: {
              type: "string",
              description: "The assignment ID",
            },
            course_id: {
              type: "string",
              description: "The course ID",
            },
            language: {
              type: "string",
              description: "Programming language (default: java)",
            },
          },
          required: ["code", "goal_id", "assignment_id", "course_id"],
        },
      },
    ] as Tool[],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "login": {
        if (!args) {
          throw new Error("Arguments are required for login");
        }
        const result = await login(
          (args.email as string).trim(),
          args.password as string
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list-todo": {
        const result = await listTodo();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "list-courses": {
        const result = await listCourses(args?.userId as string | undefined);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get-course-details": {
        if (!args) {
          throw new Error("Arguments are required for get-course-details");
        }
        const result = await getCourseDetails((args.course_id as string).trim());
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get-assignment-details": {
        if (!args) {
          throw new Error("Arguments are required for get-assignment-details");
        }
        const result = await getAssignmentDetails(
          (args.course_id as string).trim(),
          (args.goal_id as string).trim()
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "submit-code": {
        if (!args) {
          throw new Error("Arguments are required for submit-code");
        }
        const result = await submitCode(
          args.code as string,
          (args.goal_id as string).trim(),
          (args.assignment_id as string).trim(),
          (args.course_id as string).trim(),
          (args.language as string) || "java"
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SkillCaptain MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});