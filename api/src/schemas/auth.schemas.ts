import { z } from "zod";

// GET /whoami
// Return authenticated user
const whoAmISchema = z.object({});

export { whoAmISchema };
