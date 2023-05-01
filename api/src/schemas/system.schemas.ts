import { z } from "zod";

// get /status
// Return the API status
const getSystemStatusSchema = z.object({});

export { getSystemStatusSchema };
