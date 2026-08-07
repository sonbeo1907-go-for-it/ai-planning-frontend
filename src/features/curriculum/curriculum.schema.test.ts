import { describe, expect, it } from "vitest";

import {
  createCourseSchema,
  createModuleSchema,
  updateCourseSchema,
  updateModuleSchema,
} from "./curriculum.schema";

describe("course schemas", () => {
  it("accepts the backend create contract", () => {
    expect(createCourseSchema.safeParse({
      code: " FULLSTACK_JAVA ",
      name: " Fullstack Java ",
      description: " Training program ",
    }).data).toEqual({
      code: "FULLSTACK_JAVA",
      name: "Fullstack Java",
      description: "Training program",
    });
  });

  it.each(["_JAVA", "JAVA_", "JAVA__FULLSTACK", "JAVA-STACK"])(
    "rejects invalid course code %s",
    (code) => {
      expect(createCourseSchema.safeParse({ code, name: "Java" }).success)
        .toBe(false);
    },
  );

  it("enforces backend field limits", () => {
    expect(createCourseSchema.safeParse({
      code: "A".repeat(51),
      name: "N".repeat(151),
      description: "D".repeat(4001),
    }).success).toBe(false);
  });

  it("does not accept code or status in an update schema", () => {
    const result = updateCourseSchema.safeParse({
      code: "CHANGED_CODE",
      name: "Updated course",
      description: "Updated",
      status: "INACTIVE",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: "Updated course",
      description: "Updated",
    });
  });
});

describe("module schemas", () => {
  it("accepts a valid module payload", () => {
    expect(createModuleSchema.safeParse({
      code: "JAVA_CORE",
      name: "Java Core Basic",
      description: "Nội dung Java căn bản",
      sequenceNumber: 1,
    }).success).toBe(true);
  });

  it.each(["JAVA-CORE!", "_JAVA", "JAVA_"])(
    "rejects invalid module code %s",
    (code) => {
      expect(createModuleSchema.safeParse({ code, name: "Java Core" }).success)
        .toBe(false);
    },
  );

  it("rejects an empty module name", () => {
    expect(createModuleSchema.safeParse({
      code: "JAVA_CORE",
      name: "",
    }).success).toBe(false);
  });

  it("accepts a valid module update", () => {
    expect(updateModuleSchema.safeParse({
      name: "Java Core Advanced",
      description: "Bổ sung kiến thức OOP nâng cao",
    }).success).toBe(true);
  });

  it("rejects an empty module name in an update", () => {
    expect(updateModuleSchema.safeParse({
      name: "",
      description: "Mô tả hợp lệ",
    }).success).toBe(false);
  });
});
