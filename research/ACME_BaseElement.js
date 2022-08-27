class ACME_BaseElement extends HTMLElement {
  // ======================================================== ACME_BaseElement.$query
  $query(
    // selector is a DOM selector string eg. "div:not[id='1']"
    // if starts with * then return all elements as NodeList
    // if starts with ** then return all elements as Array
    selector,
    // optional 2nd parameter is the root element to query from
    root = this.shadowRoot || this
  ) {
    if (selector.charAt(0) === "*" || selector.charAt(1) === "*") {
      if (selector.charAt(1) === "*") {
        return [...root.querySelectorAll(selector.slice(2))];
      } else {
        return root.querySelectorAll(selector.slice(1));
      }
    } else return root.querySelector(selector);
  }
  // ======================================================== ACME_BaseElement.$element
  $element({
    tag = "div", // HTML tag name "div", if start with * or ** call $query to get element
    props = {}, // properties (and eventlisteners) attached to element
    attrs = [], // attributes attached to element
    classes = [],
    events = {}, // standard eventlisteners attached to element
    customevents = {
      eventname: {},
    }, // custom eventlisteners attached to element
    prepend = [], // element.prepend(...prepend)
    html, // element.innerHTML
    append = [], // element.append(...append)
    // optional override new element with existing element
    element = tag.charAt(0) === "*"
      ? this.$query(tag)
      : document.createElement(tag),
    ...moreprops
  }) {
    element = Object.assign(element, { ...props, ...events, ...moreprops });
    classes = classes.filter((x) => x.length);
    if (classes.length) element.classList.add(...classes);
    element.prepend(...prepend.filter(Boolean));
    if (html) element.innerHTML = html;
    element.append(...append.filter(Boolean));
    if (Array.isArray(attrs)) {
      attrs.map(([key, value]) => element.setAttribute(key, value));
    } else {
      Object.entries(attrs).map(([key, value]) =>
        element.setAttribute(key, value)
      );
    }
    element.addEventListener(new CustomEvent("removeEventListeners"), (evt) => {
      element.removeEventListeners(evt);
    });
    return element;
  }
  $elementHTML({
    tag = "div", // HTML tag name
    html = "",
    attrs = "",
  }) {
    return `<${tag} ${attrs}>${html}</${tag}>`;
  }
  // ======================================================== ACME_BaseElement.disconnectedCallback
  disconnectedCallback() {
    console.warn("" + this.tagName + " disconnected");
  }
  // ======================================================== ACME_BaseElement.connectedCallback
  connectedCallback(...args) {
    let scope = this;
    //! register all methods starting with event_ as $listener
    function registerEventMethods({ scope, eventbus = document }) {
      Object.getOwnPropertyNames(Object.getPrototypeOf(scope)).map((method) => {
        let [event, ...name] = method.split("_"); //! name becomes an Array!
        if (event == "event") {
          //! determine name and eventbus where to listen
          name = name.join("_"); // make sure second _ in event_nameX_nameY is possible
          if (name[0] === "$") {
            // $click is registered on scope/this element
            name = name.slice(1); // remove $
            eventbus = scope; // listening at current element level
          }
          // log(
          //   scope.nodeName + ` %c ${name} %c ${eventbus.nodeName}`,
          //   "background:gold;",
          //   "background:skyblue",
          //   method
          // );
          let useCapture = name.includes("_capture");
          if (useCapture) name = name.replace("_capture", "");

          // register the listener
          scope.$listen({
            name, // eventName
            eventbus,
            handler: scope[method].bind(scope),
            useCapture,
          });
        }
      }); // getOwnPropertyNames
    } // registerEventMethods
    registerEventMethods(scope);
    //if (scope["render_once"]) scope["render_once"].call(scope);
    //!if (scope["render"]) scope["render"].apply(scope,...args);
  }
  // ======================================================== ACME_BaseElement.$dispatch
  $dispatch({
    name, // EventName
    detail = {}, // event.detail
    // override options PER option:
    bubbles = true, // default, bubbles up the DOM
    composed = true, // default, escape shadowRoots
    cancelable = true, // default, cancelable event bubbling
    // optional overwrite whole options settings, or use already specified options
    options = {
      bubbles,
      composed,
      cancelable,
    },
    eventbus = this, // default dispatch from current this element or use something like eventbus:document
    once = false, // default .dispatchEvent option to execute a Listener once
  }) {
    //console.warn("%c EventName:", "background:yellow", name, [detail]);
    window.ColorDialogEvents = window.ColorDialogEvents || new Set();
    window.ColorDialogEvents.add(name);
    eventbus.dispatchEvent(
      new CustomEvent(name, {
        ...options, //
        detail,
      }),
      once // default false
    );
  }
  // ======================================================== ACME_BaseElement.$emit
  // shorthand code for $dispatch({})
  $emit(name, detail = {}, root = this) {
    root.$dispatch({
      name, // eventName
      detail, // evt.detail
    });
  }
  // ======================================================== ACME_BaseElement.$listen
  $listen({
    name = this.nodeName, // first element is String or configuration Object{}
    handler = () => {}, // optional handler FUNCTION, default empty function
    eventbus = this, // at what element in the DOM the listener should be attached
    useCapture = false, // optional, default false
  }) {
    eventbus.addEventListener(
      name,
      (evt) => handler(evt),
      useCapture // default false
    );
    // record all listeners on this element
    this._listeners = this._listeners || [];
    this._listeners.push(() => eventbus.$removeEventListener(name, handler));
  }
  // ======================================================== ACME_BaseElement.removeEventListeners
  $removeEventListeners() {
    this._listeners.map((x) => x());
  }
  // ======================================================== ACME_BaseElement
}
