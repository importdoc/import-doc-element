import { Element, Component, State, Listen, Prop, h } from "@stencil/core";

@Component({
  tag: "import-doc",
  styleUrl: "import-doc.css",
  shadow: true
})
export class ImportDoc {
  @Prop() src: string;
  @Element() el: HTMLElement;

  @State() focused: boolean = false;
  @State() document: string = "";

  @Listen("focus", { target: "window" })
  async handleFocus() {
    this.focused = true;
  }

  @Listen("blur", { target: "window" })
  handleBlur() {
    this.focused = false;
  }

  private async fetchDocument(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.statusText}`);
      }
      const text = await response.text();
      if (this.src !== url) {
        return "";
      }
      return text;
    } catch (e) {
      console.error(e);
      return "";
    }
  }

  async componentDidLoad() {
    this.document = await this.fetchDocument(this.src);
  }

  async componentWillUpdate() {
    if (this.focused) {
      this.document = await this.fetchDocument(this.src);
    }
  }

  render() {
    if (!this.document) {
      return <slot name="loading" />;
    }
    return <div innerHTML={this.document}></div>;
  }
}
