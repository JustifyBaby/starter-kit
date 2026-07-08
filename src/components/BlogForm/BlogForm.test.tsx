import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import BlogForm from "./BlogForm";
import { BlogFormSchema } from "@schema/BlogSchema";
import { getDOMLen, getExpectLenBySchema } from "@/types/global/getExpectLen";

describe(`
  Component: BlogForm
`, () => {
  test(`Does expand success?`, () => {
    render(<BlogForm />);
    const expectLength = getExpectLenBySchema(BlogFormSchema);
    expect(getDOMLen("label")).toBe(expectLength);
    expect(getDOMLen("input")).toBe(expectLength);
  });
});
