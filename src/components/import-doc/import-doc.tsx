import {
  Component,
  State,
  Element,
  Listen,
  Prop,
  h,
  Watch,
  Host,
} from "@stencil/core";
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserverPolyfill;
  }
}

const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;

@Component({
  tag: "import-doc",
  styleUrl: "import-doc.css",
})
export class ImportDoc {
  @Element() element?: HTMLElement;
  @Prop() dataId?: string;
  @Prop() src?: string;
  @Prop() noFonts?: boolean;

  container?: HTMLDivElement;
  ro?: ResizeObserverPolyfill;

  @State() focused: boolean = false;
  @State() loading?: boolean = true;
  @State() breakpoints?: { [breakpoint: string]: number };

  @Watch("dataId")
  async watchHandler(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.loading = true;
      await this.fetchDocument();
      this.loading = false;
    }
  }

  @Listen("focus", { target: "window" })
  handleFocus() {
    this.focused = true;
  }

  @Listen("blur", { target: "window" })
  handleBlur() {
    this.focused = false;
  }

  private async fetchDocument(force: boolean = false) {
    try {
      const url = this.dataId
        ? `API_URL/document?id=${this.dataId}${force ? "&force=true" : ""}${
            this.noFonts ? "" : "&fonts=true"
          }`
        : this.src;
      if (!url) return;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.statusText}`);
      }
      const data = await response.text();
      if (this.container) {
        this.container.innerHTML = data;
        const data_element = this.container.querySelector("#__IMPORTDOC_DATA");
        if (data_element) {
          this.breakpoints = JSON.parse(data_element.innerHTML).breakpoints;
        }
      }
      this.loading = false;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  componentDidLoad() {
    this.ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.container?.style.setProperty(
          "--ew",
          entry.contentRect.width + "px"
        );
        if (this.breakpoints)
          Object.keys(this.breakpoints).forEach((breakpoint: string) => {
            const minWidth = this.breakpoints && this.breakpoints[breakpoint];
            if (minWidth && entry.contentRect.width >= minWidth) {
              entry.target.classList.add(breakpoint);
            } else {
              entry.target.classList.remove(breakpoint);
            }
          });
      });
    });
    this.container && this.ro?.observe(this.container);
    return this.fetchDocument();
  }

  componentDidUnload() {
    this.ro?.disconnect();
  }

  componentWillUpdate() {
    if (this.focused) {
      return this.fetchDocument(true);
    }
  }

  render() {
    return (
      <Host>
        <div
          style={{ display: this.loading ? "none" : "block" }}
          ref={(el) => (this.container = el as HTMLDivElement)}
        ></div>
        <div style={{ display: this.loading ? "block" : "none" }}>
          <slot name="loading" />
        </div>
      </Host>
    );
  }
}
