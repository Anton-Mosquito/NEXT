// src/shared/lib/__tests__/utils.test.ts
import { cn, formatDate, truncate, getReadingTime, debounce } from "../index";

// ============================================================
// cn() — classnames utility
// ============================================================
describe("cn()", () => {
  it("об'єднує рядки з пробілом", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("фільтрує falsy значення", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("повертає порожній рядок якщо нічого не передано", () => {
    expect(cn()).toBe("");
  });

  it("повертає один клас без зайвих пробілів", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("умовні класи", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active",
    );
  });
});

// ============================================================
// truncate() — обрізання тексту
// ============================================================
describe("truncate()", () => {
  it("не обрізає короткий текст", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("обрізає довгий текст та додає ...", () => {
    const result = truncate("hello world", 5);
    expect(result).toContain("...");
    expect(result.length).toBeLessThanOrEqual(8); // 5 + '...'
  });

  it("точно на межі — не обрізає", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

// ============================================================
// getReadingTime() — час читання
// ============================================================
describe("getReadingTime()", () => {
  it("розраховує для 200 слів = 1 хвилина", () => {
    const text = Array(200).fill("word").join(" ");
    expect(getReadingTime(text)).toBe(1);
  });

  it("округлює вверх", () => {
    const text = Array(201).fill("word").join(" ");
    expect(getReadingTime(text)).toBe(2);
  });

  it("кастомна швидкість читання", () => {
    const text = Array(100).fill("word").join(" ");
    expect(getReadingTime(text, 100)).toBe(1);
  });

  it("порожній текст = 0", () => {
    expect(getReadingTime(" ")).toBe(0);
  });
});

// ============================================================
// debounce() — відкладений виклик
// ============================================================
describe("debounce()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("викликає функцію після затримки", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("arg1");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("arg1");
  });

  it("скидає таймер при повторному виклику", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("first");
    vi.advanceTimersByTime(200);
    debounced("second");
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("second");
  });
});
