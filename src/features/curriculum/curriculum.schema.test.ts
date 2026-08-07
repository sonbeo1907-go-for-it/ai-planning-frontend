import { describe, it, expect } from "vitest";
import { createModuleSchema, updateModuleSchema } from "./curriculum.schema";

describe("createModuleSchema", () => {
  it("validates correct module payload", () => {
    const validData = {
      code: "JAVA_CORE",
      name: "Java Core Basic",
      description: "Nội dung Java căn bản",
      sequenceNumber: 1,
    };
    const result = createModuleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when code contains invalid characters", () => {
    const invalidData = {
      code: "JAVA-CORE!",
      name: "Java Core",
    };
    const result = createModuleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when name is empty", () => {
    const invalidData = {
      code: "JAVA_CORE",
      name: "",
    };
    const result = createModuleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("updateModuleSchema", () => {
  it("validates correct update payload", () => {
    const validData = {
      name: "Java Core Advanced (Updated)",
      description: "Bổ sung kiến thức OOP Nâng cao",
    };
    const result = updateModuleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when name is empty in update", () => {
    const invalidData = {
      name: "",
      description: "Mô tả hợp lệ",
    };
    const result = updateModuleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
