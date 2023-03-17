!(function () {
  let sort_diagonal_positions_topleft_2_bottomright = [
    0, 7, 1, 14, 8, 2, 21, 15, 9, 3, 28, 22, 16, 10, 4, 35, 29, 23, 17, 11, 5,
    42, 36, 30, 24, 18, 12, 6, 49, 43, 37, 31, 25, 19, 13, 56, 50, 44, 38, 32,
    26, 20, 63, 57, 51, 45, 39, 33, 27, 70, 64, 58, 52, 46, 40, 34, 77, 71, 65,
    59, 53, 47, 41, 84, 78, 72, 66, 60, 54, 48, 91, 85, 79, 73, 67, 61, 55, 98,
    92, 86, 80, 74, 68, 62, 105, 99, 93, 87, 81, 75, 69, 112, 106, 100, 94, 88,
    82, 76, 119, 113, 107, 101, 95, 89, 83, 126, 120, 114, 108, 102, 96, 90,
    133, 127, 121, 115, 109, 103, 97, 134, 128, 122, 116, 110, 104, 135, 129,
    123, 117, 111, 136, 130, 124, 118, 137, 131, 125, 138, 132, 139,
  ];
  const __EVENTBASENAME__ = "🎨";
  const __ELEMENT_APP__ = "html-color-picker";
  const __ELEMENT_TEXT__ = __ELEMENT_APP__ + "-text";
  const __ELEMENT_HEADER__ = __ELEMENT_APP__ + "-header";
  const __ELEMENT_COLOR__ = __ELEMENT_APP__ + "-color";
  const __ELEMENT_LABEL__ = __ELEMENT_APP__ + "-label";
  const __ELEMENT_COLOR_GRID__ = __ELEMENT_APP__ + "-color-grid";
  const __ELEMENT_TOOLBAR__ = __ELEMENT_APP__ + "-toolbar";
  const __ELEMENT_ICON__ = __ELEMENT_APP__ + "-svg-icon";
  const __ELEMENT_COLOR_DIALOG_SORT_GRID__ = __ELEMENT_APP__ + "-sort-list";

  const __COLOR_distanceLab__ = "distanceLab";
  const __COLOR_distanceRGB__ = "distanceRGB";
  const __COLOR_name__ = "name";
  const __COLOR_hex__ = "hex";

  const __APP_COLOR__ = "rebeccapurple";

  //! vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  //! Event names matching "event_name" methods on Elements!
  const __EVENTNAME_DIALOG_STATE__ = "colordialogstate";
  const __EVENTNAME_COLORDRAG__ = "colordrag";
  const __EVENTNAME_COLORMATCH__ = "colormatch";
  const __EVENTNAME_STORECOLORS__ = "storecolors";
  const __EVENTNAME_READCOLORS__ = "readcolors";
  const __EVENTNAME_SORT__ = "sort";
  //! ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const __CSS_SEARCH_NOMATCH__ = `opacity:.3;display:none;`;

  // ********************************************************** log function
  function log(...args) {
    let label = args.shift();
    console.log(
      `%c ${label} `,
      `background:${__APP_COLOR__};color:gold;font-size:120%`,
      ...args
    );
  }
  function todo() {
    console.warn(`%c todo:`, "background:gold;color:black", ...arguments);
  }
  function ensureHexcolor(color) {
    return ("#" + color).replace("##", "#");
  }
  // ********************************************************** Array functions
  // ======================================================== chunkArray
  /**
   * chunck an Array in equal sizes
   * @param {array} inputArray - input array
   * @param {number} chunksize
   */
  const chunkArray = (
    inputArray, // input & processing Array
    chunksize = 1, // chunk size
    // end 2 parameters
    // catch invalid sizes
    size = chunksize < 1 ? 1 : chunksize,
    // declare helper array
    chunks = [inputArray.splice(0, size)] // result: initialized on first call, add first chunk
  ) =>
    chunks.concat(
      // process remaining chunk
      inputArray.length ? chunkArray(inputArray, size) : [] // concat needs an argument , [] is concatted last!
    );
  // ======================================================== createMatrixArray
  const createMatrixArray = (
    width,
    height = width,
    value = 0,
    callback = (val, i) => (value ? val : i)
  ) =>
    chunkArray(
      Array(width * height)
        .fill(value)
        .map(callback),
      width
    );
  // ======================================================== spiralMatrixTraversal
  function spiralMatrixTraversal(matrix) {
    const outputMatrix = [];
    while (matrix.length) {
      outputMatrix.push(
        ...matrix.shift(), // right: get first array [0,1,2,3]
        ...matrix.map((a) => a.pop()), // down: get all last array values [7,11,15]
        ...(matrix.pop() || []).reverse(), // left: get last array, reverse [14,13,12]
        ...matrix.map((a) => a.shift()).reverse() // up: get all first array values, reverse
      );
    }
    return outputMatrix;
  }

  let colorSpiralOrder = spiralMatrixTraversal(createMatrixArray(7, 20));
  // ********************************************************** ACME_BaseClass
  class ACME_BaseClass extends HTMLElement {
    // ======================================================== ACME_BaseClass.$query
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
    // ======================================================== ACME_BaseClass.$elementHTML
    $elementHTML({
      tag = "div", // HTML tag name
      html = "",
      attrs = "",
    }) {
      return `<${tag} ${attrs}>${html}</${tag}>`;
    }
    // ======================================================== ACME_BaseClass.$element
    $element({
      tag = "div", // HTML tag name "div", if start with * or ** call $query to get element
      props = {}, // properties (and eventlisteners) attached to element
      attrs = [], // attributes attached to element
      classes = [],
      events = {}, // standard eventlisteners attached to element
      listeners = {}, // custom eventlisteners attached to element, when added to the DOM
      customevents = {}, // custom eventlisteners attached to element
      prepend = [], // element.prepend(...prepend)
      html, // element.innerHTML
      append = [], // element.append(...append)
      // optional override new element with existing element
      element = tag.charAt(0) === "*"
        ? this.$query(tag) // do not create a new tag, find existing element
        : document.createElement(tag), // else create a new tag
      styles = {},
      //stuff any other properties into moreprops variable
      ...moreprops
    }) {
      // assign props,events and moreprops to element
      element = Object.assign(element, { ...props, ...events, ...moreprops });
      // filter out empty classes
      classes = classes.filter((x) => x.length);
      if (classes.length) element.classList.add(...classes);

      element.prepend(...prepend.filter(Boolean));
      if (html) element.innerHTML = html;
      element.append(...append.filter(Boolean));

      (Array.isArray(attrs)
        ? attrs // if attrs is an Array, do a setAttribute for each attribute
        : Object.entries(attrs)
      ) // else proces as Object
        .map(([key, value]) => element.setAttribute(key, value));

      // apply styles
      Object.entries(styles).map(([key, value]) => {
        element.style[key] = value;
      });
      // apply customevents
      Object.entries(customevents).map(([name, handler]) => {
        console.log(name, handler, this);
        this.$listen_signal({
          name,
          handler: handler.bind(element), // bind element scope to handler
          eventbus: document,
        });
      });

      // add listener to remove all eventlisteners on element
      element.addEventListener(
        new CustomEvent("removeEventListeners"),
        (evt) => {
          element.removeEventListeners(evt);
        }
      );
      return element;
    }
    // ======================================================== ACME_BaseClass.disconnectedCallback
    disconnectedCallback() {
      console.warn("" + this.tagName + " disconnected");
    }
    // ======================================================== ACME_BaseClass.eventbus
    get eventbus() {
      return this.__eventbus__ || document;
    }
    // ======================================================== ACME_BaseClass.connectedCallback
    connectedCallback(...args) {
      let scope = this;
      //! register all methods starting with event_ as $listener
      function registerEventMethods({ scope }) {
        Object.getOwnPropertyNames(Object.getPrototypeOf(scope)).map(
          (method) => {
            let eventbus;
            let [event, ...name] = method.split("_"); //! name becomes an Array!
            if (event == "event") {
              //! determine name and eventbus where to listen
              name = name.join("_"); // make sure second _ in event_nameX_nameY is possible
              if (name[0] === "$") {
                // $click is registered on scope/this element
                name = name.slice(1); // remove $
                eventbus = scope; // listening at current element level
              } else {
                // event_nameX_nameY is registered on document
                eventbus = scope.eventbus; // listening at document level
              }
              // if (name == "borderColor")
              //   log(
              //     scope.nodeName + ` %c ${name} %c ${eventbus.nodeName}`,
              //     "background:gold;",
              //     "background:skyblue",
              //     method,
              //     eventbus
              //   );
              let useCapture = name.includes("_capture");
              if (useCapture) name = name.replace("_capture", "");

              // register the listener
              scope.$listen_signal({
                name, // eventName
                eventbus,
                handler: scope[method].bind(scope),
                useCapture,
              });
            }
          }
        ); // getOwnPropertyNames
      } // registerEventMethods
      registerEventMethods({ scope });
      //if (scope["render_once"]) scope["render_once"].call(scope);
      //!if (scope["render"]) scope["render"].apply(scope,...args);
    }
    // ======================================================== ACME_BaseClass.$dispatch
    $dispatch_signal({
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
      window.HTMLColorPicker_Events =
        window.HTMLColorPicker_Events || new Set();
      window.HTMLColorPicker_Events.add(name);
      eventbus.dispatchEvent(
        new CustomEvent(name, {
          ...options, //
          detail,
        }),
        once // default false
      );
    }
    // ======================================================== ACME_BaseClass.$emit
    // shorthand code for $dispatch({})
    $emit_signal(name, detail = {}, root = this) {
      root.$dispatch_signal({
        name, // eventName
        detail, // evt.detail
      });
    }
    // ======================================================== ACME_BaseClass.$listen
    $listen_signal({
      name = this.nodeName, // first element is String or configuration Object{}
      handler = () => { }, // optional handler FUNCTION, default empty function
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
    // ======================================================== ACME_BaseClass.removeEventListeners
    $removeEventListeners() {
      this._listeners.map((x) => x());
    }
    // ======================================================== ACME_BaseClass
  }

  // ********************************************************** ACME_BaseClass

  // ********************************************************** BaseClass
  class BaseClass extends ACME_BaseClass {
    //! no connectedCallback defined, calls super.connectedCallback() by default!
    // connectedCallback() {
    //   super.connectedCallback();
    // }
    // ========================================================BaseClass.sorts
    static get sorts() {
      const sortFunc = (key) => (a, b) => a.colors[key] - b.colors[key];
      return {
        alfabetical: (a, b) => a.colors.name.localeCompare(b.colors.name),
        index: sortFunc("index"),
        reverse: (a, b) => b.index - a.index, // reverse order
        hex: (a, b) => {
          return a.colors.hexint - b.colors.hexint;
        },
        contrast: sortFunc("contrastValue"),
        ["contrast reverse"]: (a, b) =>
          b.colors.contrastValue - a.colors.contrastValue,
        contrastRed: sortFunc("contrastRed"),
        contrastGreen: sortFunc("contrastGreen"),
        contrastBlue: sortFunc("contrastBlue"),
        rgb: (a, b) => a.colors.rgb[2] - b.colors.rgb[2],
        namelength: (a, b) => a.id.length - b.id.length,
        spiral: sortFunc("spiral"),
        [__COLOR_distanceRGB__]: sortFunc(__COLOR_distanceRGB__),
        [__COLOR_distanceLab__]: sortFunc(__COLOR_distanceLab__),
        user1: sortFunc("user1"),
      };
    }
    // ========================================================BaseClass.eyedropper
    eyedropper() {
      this.$emit_signal(__EVENTNAME_DIALOG_STATE__, "close");
      if (!window.EyeDropper) {
        console.warn("Your browser does not support the EyeDropper API");
        this.$emit_signal(
          "colordialogtoast", // to be implemented
          "Your browser does not support the EyeDropper API"
        );
        return;
      }
      const eyeDropper = new EyeDropper();
      eyeDropper
        .open()
        .then((result) => {
          this.$emit_signal(__EVENTNAME_DIALOG_STATE__, "open");
          this.$emit_signal("colormatch", result.sRGBHex);
        })
        .catch((e) => {
          console.log("eyedropper canceled", e);
        });
    }
    // ========================================================BaseClass.colors
    static get colors() {
      /**
       these color names are standardized, not because they are good, but because their use and implementation has been widespread for decades 
       and the standard needs to reflect reality. 
       Indeed, it is often hard to imagine what each name will look like (hence the list below); 
       the names are not evenly distributed throughout the sRGB color volume, the names are not even internally consistent ( darkgray is lighter than gray, 
       while lightpink is darker than pink), and some names (such as indianred, which was originally named after a red pigment from India), 
       have been found to be offensive. Thus, their use is not encouraged.
       */
      return (
        `white,gainsboro,silver,darkgray,gray,dimgray,black,` +
        `whitesmoke,lightgray,lightcoral,rosybrown,indianred,red,maroon,` +
        `snow,mistyrose,salmon,orangered,chocolate,brown,darkred,` +
        `seashell,peachpuff,tomato,darkorange,peru,firebrick,olive,` +
        `linen,bisque,darksalmon,orange,goldenrod,sienna,darkolivegreen,` +
        `oldlace,antiquewhite,coral,gold,limegreen,saddlebrown,darkgreen,` +
        `floralwhite,navajowhite,lightsalmon,darkkhaki,lime,darkgoldenrod,green,` +
        `cornsilk,blanchedalmond,sandybrown,yellow,mediumseagreen,olivedrab,forestgreen,` +
        `ivory,papayawhip,burlywood,yellowgreen,springgreen,seagreen,darkslategray,` +
        `beige,moccasin,tan,chartreuse,mediumspringgreen,lightseagreen,teal,` +
        `lightyellow,wheat,khaki,lawngreen,aqua,darkturquoise,darkcyan,` +
        `lightgoldenrodyellow,lemonchiffon,greenyellow,darkseagreen,cyan,deepskyblue,midnightblue,` +
        `honeydew,palegoldenrod,lightgreen,mediumaquamarine,cadetblue,steelblue,navy,` +
        `mintcream,palegreen,skyblue,turquoise,dodgerblue,blue,darkblue,` +
        `azure,aquamarine,lightskyblue,mediumturquoise,lightslategray,blueviolet,mediumblue,` +
        `lightcyan,paleturquoise,lightsteelblue,cornflowerblue,slategray,darkorchid,darkslateblue,` +
        `aliceblue,powderblue,thistle,mediumslateblue,royalblue,darkviolet,rebeccapurple,` +
        `ghostwhite,lightblue,plum,mediumpurple,slateblue,magenta,indigo,` +
        `lavender,pink,violet,orchid,mediumorchid,mediumvioletred,purple,` +
        `lavenderblush,lightpink,hotpink,palevioletred,deeppink,crimson,darkmagenta`
      );
    }
    // ========================================================BaseClass.rgb2hex
    rgb2hex(colorRGBString) {
      let rgb = colorRGBString.substr(4).split(")")[0].split(","),
        r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

      if (r.length == 1) r = "0" + r;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;

      return "#" + r + g + b;
    }
    // ========================================================BaseClass.contrastColor
    contrastColor(color = "ffffff", low = "black", high = "beige") {
      color = color.replace("#", "");
      return (parseInt(color.slice(0, 2), 16) * 299 +
        parseInt(color.slice(2, 4), 16) * 587 +
        parseInt(color.slice(4, 6), 16) * 114) /
        1000 >=
        136
        ? low
        : high;
    }
  }

  // ********************************************************** <HCP-label>
  customElements.define(
    __ELEMENT_LABEL__,
    class extends BaseClass {
      // ======================================================== <HCP-label>.event_click
      event_$click(evt) {
        evt.preventDefault();
        let text = this.textContent;
        navigator.clipboard.writeText(text).then(
          () => {
            log("Copied to clipboard: ", text);
            /* Resolved - text copied to clipboard */
          },
          () => {
            /* Rejected - clipboard failed */
          }
        );
      }
    }
  );

  // ********************************************************** <HCP-color>
  customElements.define(
    __ELEMENT_COLOR__,
    class extends BaseClass {
      // ======================================================== <HCP-color>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        if (this.initialized) return; // connectedCallback runs every time it is added AND MOVED in the DOM
        this.initialized = true;

        this.render();
      }
      // ======================================================== <HCP-color>.set order
      set order(n) {
        this.style.setProperty("order", n);
      }
      get order() {
        return this.style.getPropertyValue("order");
      }
      // ======================================================== <HCP-color>.set name
      set name(n) {
        this.querySelector("." + __COLOR_name__).innerHTML = n;
      }
      get name() {
        return this.id;
      }
      // ======================================================== <HCP-color>.set hex
      set hex(h) {
        this.querySelector("." + __COLOR_hex__).textContent = h;
      }
      // ======================================================== <HCP-color>.set color
      get color() {
        return getComputedStyle(this).backgroundColor;
      }
      set color(name) {
        this.style.backgroundColor = name; // change backgroundcolor
        let hex = this.rgb2hex(this.color).replace("#", "").toUpperCase();
        let colors = Object.assign(this.colors, {
          // key names match sorts names
          name,
          hex,
          contrastRed: parseInt(hex.slice(0, 2), 16) * 299,
          contrastGreen: parseInt(hex.slice(2, 4), 16) * 587,
          contrastBlue: parseInt(hex.slice(4, 6), 16) * 114,
          rgb: [
            +("0x" + hex.slice(0, 2)),
            +("0x" + hex.slice(2, 4)),
            +("0x" + hex.slice(4, 6)),
          ],
          spiral: colorSpiralOrder[this.index],
          user1: this.index,
          contrast: (this.style.color = this.contrastColor(hex)),
          hexint: parseInt(hex, 16),
        });
        colors.contrastValue =
          colors.contrastRed + colors.contrastGreen + colors.contrastBlue;
        // change labels
        this.name = name;
        this.hex = hex;
      }
      // ======================================================== <HCP-color>.event_$click
      event_$click(evt) {
        // todo special ctrlKey event notation?
        //if (evt.ctrlKey)
        this.$emit_signal("colormatch", this.colors.hex);
      }
      //! event_ handlers configured automagically in BaseElement
      // ======================================================== <HCP-color>.event_namematch
      // Every <HCP-color> listens to every "namematch" event, to match by name
      event_namematch(evt) {
        const namematch = evt.detail;
        if (namematch) {
          const toggleState =
            this.name.includes(namematch) || this.colors.hex.includes(namematch);
          this.classList.toggle("namematched", toggleState);
          this.name = this.name.replaceAll(namematch, `<b>${namematch}</b>`);
        } else {
          this.classList.remove("namematched"); //todo required, toggle does it?
        }
      }
      // ======================================================== <HCP-color>.event_matchcolorname
      event_matchcolorname(evt) {
        if (this.name == evt.detail.color) {
          log(
            `YEAH! I AM %c ${this.name}`,
            `background:${this.name};color:${this.colors.contrast}`
          );
          // execute
          evt.detail.callback(this.colors.hex);
        }
      }
      // ======================================================== <HCP-color>.event_colormatch
      //! event_namematch doesn't fire on colormatch, remove namematched class
      event_colormatch(evt) {
        this.classList.remove("namematched");
        // set opacity according to distance from match color
        // console.error("fading opacity",this.colors.contrastValue);
      }
      // ======================================================== <HCP-color>.event_indexmatch
      event_indexmatch(evt) {
        if (evt.detail.indexmatch == this.index) {
          this.color = evt.detail.color;
        }
      }
      // ======================================================== <HCP-color>.render
      render() {
        this.replaceChildren(
          ...[__COLOR_name__, __COLOR_hex__]
            .map((colorProperty) =>
              this.$element({
                tag: __ELEMENT_LABEL__,
                classes: [colorProperty], // name, hex
                //innerHTML: this.colors[colorProperty] || "",// set by this.color call below
              })
            )
            .filter(Boolean) // only return valid elements
        );
        this.color = this.name;
        this.initdrag();
      }
      // ======================================================== <HCP-color>.initdrag
      initdrag() {
        this.initdrag = () => { }; //! overload initdrag, so it runs only once

        this.setAttribute("draggable", true);

        const /* function */ dispatch = (detail) =>
          this.$dispatch_signal({ name: __EVENTNAME_COLORDRAG__, detail });

        Object.assign(this, {
          ondragstart: (evt) => {
            log("dragging:", this.id);
            dispatch({
              dragcolor: this,
            });
          },
          ondragenter: (evt) => { },
          ondragleave: (evt) => { },
          ondragover: (evt) => {
            dispatch({
              dragover: this,
            });
          },
          ondragend: (evt) => {
            //! endrag handled by <grid>event_colordrag
            dispatch({
              dragover: undefined,
            });
          },
        });
      }
      // ======================================================== <HCP-color>.swapwith< app >
      swapwith(color) {
        let saveorder = this.order;
        this.order = color.order;
        color.order = saveorder;
      }
    }
  );

  // ********************************************************** <HCP-color-grid>
  customElements.define(
    __ELEMENT_COLOR_GRID__,
    class extends BaseClass {
      // ======================================================== <HCP-color-grid>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        this.drag = {};
        this.render();
      } //connectedCallback
      // ======================================================== <HCP-color-grid>.render
      render(colors = this.getAttribute("colors") || BaseClass.colors) {
        this.elements = colors.split`,`
          .slice(0, 140)
          .map((colordef) => colordef.split`:`)
          .map(([colorname], index) =>
            this.$element({
              tag: __ELEMENT_COLOR__,
              attrs: {
                class: "", //! for HTML readability only; Move class attribute to beginning of attribute list
              },
              //props: {
              order: index, //! <HCP-color> are not redrawn! Positioning is with CSS order:index
              index, // initial index
              id: colorname,
              namelength: colorname.length,
              colors: {
                index,
                colorname,
              },
              //},
            })
          );
        this.replaceChildren(...this.elements);
      }
      // ======================================================== <HCP-color-grid>.event_readcolors
      event_readcolors(evt) {
        let colors = localStorage.getItem("color-dialog")?.split(",");
        if (colors) {
          //! this.render(colors); will disconnect existing colors
          this.elements.map((el, idx) => {
            el.order = colors.indexOf(el.id);
          });
        }
      }
      // ======================================================== <HCP-color-grid>.orderDiagonal
      orderDiagonal() {
        setTimeout(() => {
          this.childNodes.forEach((cdc) => {
            let order = cdc.order;
            let column = order % 7;
            let row = Math.floor(order / 7);
            //cdc.hex = order + " / " + diagonal[order];
            cdc.order = sort_diagonal_positions_topleft_2_bottomright[order];
          });
        });
      }
      // ======================================================== <HCP-color-grid>.sort
      sort(sortOrder = this.getAttribute("sort") || "index") {
        this.elements
          // get the wanted sortOrder Function from .sorts
          .sort(BaseClass.sorts[sortOrder])
          // change all CSS order settings
          .map((element, idx) => {
            element.order = idx;
            //element.hex = idx; // display idx, not color hex value
            //return element;
          });

        this.setAttribute("sort", sortOrder);
        this.sortOrder = sortOrder;
        localStorage.setItem(__ELEMENT_APP__ + "_sortOrder", sortOrder);
        if (sortOrder == "user1") {
          alert(`In User mode colors can be swapped with Drag & Drop\nColors are saved in localStorage`);
        }

        log(`${this.nodeName} sorted:%c ${sortOrder}`, "background:gold");
      } // render
      // ======================================================== <HCP-color-grid>.event_sort
      event_sort(evt) {
        let sortOrder = evt.detail.replace(__EVENTNAME_SORT__, ""); // strip from "sortindex" , now is "index"
        log(this.nodeName + " sorting", sortOrder);
        this.sort(sortOrder);
        if (!"alfabetical,namelength,index,user1".includes(sortOrder)) {
          //if (sortOrder != "index" && sortOrder != "user1") {
          this.orderDiagonal();
        }
        if (sortOrder === "user1") {
          this.$emit_signal(__EVENTNAME_READCOLORS__);
        }
      }
      // ======================================================== <HCP-color-grid>.event_colormatch
      event_colormatch(evt) {
        this.toggleAttribute("namematch", false);
      }
      // ======================================================== <HCP-color-grid>.event_namematch
      event_namematch(evt) {
        this.toggleAttribute("namematch", evt.detail);
      }
      // ======================================================== <HCP-color-grid>.event_colordrag
      event_colordrag(evt) {
        if (this.sortOrder == "user1") {
          let { dragcolor, dragover } = evt.detail;
          if (dragcolor) {
            // start dragging
            this.drag.color = dragcolor;
          } else {
            if (dragover) {
              // dragging over another color
              this.drag.over = dragover;
            } else {
              // end drag
              this.drag.color.swapwith(this.drag.over);
              this.drag = {};
              this.$emit_signal(__EVENTNAME_STORECOLORS__);
            }
          }
        } else {
          alert(
            "Order can only be changed in the (first icon) 'user' sortOrder view"
          );
        }
      } // event_colordrag
    }
  );

  // ********************************************************** <HCP-sort-grid>
  customElements.define(
    __ELEMENT_COLOR_DIALOG_SORT_GRID__,
    class extends BaseClass {
      // ======================================================== <HCP-sort-grid>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        this.render();
      } //connectedCallback
      // ======================================================== <HCP-sort-grid>.event_sort
      event_sort(evt) {
        let sortOrder = evt.detail;
        log(this.nodeName + " SORT", sortOrder);
        this.setAttribute("sort", sortOrder); // so it can be used in CSS selectors
        //this.$query("select").value = sortOrder; // todo, write as Event pattern
      }
      // ======================================================== <HCP-sort-grid>.event_setnamematch
      event_setnamematch(evt) {
        this.inputElement.value = evt.detail;
        this.inputElement.dispatchEvent(new Event("keyup"));
      }
      // ======================================================== <HCP-sort-grid>.input_namematch
      input_namematch(namematch = "") {
        // this.$emit("attribute_namematch", namematch);
        //this.$emit("borderColor", __APP_COLOR__);
        this.$emit_signal("namematch", { namematch: false });
        // if ABCDEF highlight nearest colors
        if (namematch.length == 6) {
          console.log("ABCDEF", namematch);
          // this.$emit("attribute_namematch", false);
          this.$emit_signal("colormatch", namematch);
        } else {
          console.warn("Match use input", namematch);
          this.$emit_signal("namematch", namematch);
        }
      }
      // ======================================================== <HCP-sort-grid>.render
      render() {
        // --------------------------------------------------------- <input type="text">
        this.inputElement = this.$element({
          tag: "input",
          attrs: {
            type: "text",
          },
          onkeyup: (evt) => this.input_namematch(evt.target.value),
        }); // inputElement
        // --------------------------------------------------------- <select>
        this.selectElement = this.$element({
          tag: "select",
          onchange: (evt) => {
            this.$dispatch_signal({
              name: __EVENTNAME_SORT__,
              detail: evt.target.value,
            });
          },
          // ---------------------------------------------- add <option>s
          append: Object.entries(BaseClass.sorts).map(([key, func]) =>
            this.$element({
              tag: "option",
              value: key,
              innerText: key,
            })
          ),
        });
        // --------------------------------------------------------- add DOM elements
        this.replaceChildren(
          //this.selectElement,
          "search:",
          this.inputElement,

          this.$element({
            tag: "span",
            styles: {},
            innerHTML: this.$elementHTML({
              tag: __ELEMENT_TEXT__,
              html: `&nbsp;<b style="font-size:135%"> An experiment in Event driven Web Components</b>`,
            }),
          })
        ); // append
      } // render
    } // class
  ); // define <HCP-sort-grid>

  // ********************************************************** < app >
  customElements.define(
    __ELEMENT_APP__,
    class extends BaseClass {
      // ======================================================== < app >.constructor
      constructor() {
        const styleApplication =
          // dialog
          /* css  */ `dialog{--fontsize:1.6vh;max-width:100vw;max-height:100vh}` +
          /* css  */ `dialog{font:var(--fontsize) arial}` +
          /* css  */ `dialog{background:var(--borderColor,${__APP_COLOR__});color:var(--borderFontColor,beige)}` +
          //// `dialog{padding:0px;border:0}` +
          /* css  */ `dialog{border:0;border-radius:12px}` +
          // list colors
          /* css  */ `${__ELEMENT_COLOR_GRID__}{display:grid;grid:1fr/repeat(7,1fr);gap:var(--html-color-dialog-gap,1px)}` +
          // color
          /* css  */ `${__ELEMENT_COLOR__}{border:1px solid transparent}` +
          // label
          /* css  */ `${__ELEMENT_LABEL__}.hex{font-size:80%}` +
          /* css  */ `${__ELEMENT_LABEL__}:hover{background:${__APP_COLOR__};color:beige;border-color:beige}` +
          /* css  */ `${__ELEMENT_LABEL__}{text-align:center;width:100%;display:block}` +
          /* css  */ `${__ELEMENT_LABEL__}:hover{cursor:pointer}` +
          // matching typed colorname
          /* css  */ `.namematched{zoom:1.0}` +
          // dim all HCP-colors when searching for a namematch
          /* css  */ `${__ELEMENT_COLOR_GRID__}[namematch] ${__ELEMENT_COLOR__}:not(.namematched){${__CSS_SEARCH_NOMATCH__}}` +
          // footer
          ///* css  */ `dialog::after{content:"CSS can't respond to Event to change color like the icons do";background:purple;color:beige;font-size:70%;position:fixed;}` +
          // toolbar //
          /* css  */ `${__ELEMENT_TOOLBAR__}{display:flex;gap:5px;justify-content:space-evenly;width:100%;height:30px;cursor:pointer;}` +
          // size toolbar buttons //
          /* css  */ `${__ELEMENT_ICON__}{width:24px;height:24px}` +
          /* css  */ `${__ELEMENT_HEADER__}{display:grid;grid:1fr/250px 1fr 50px;background:var(--borderColor,beige)}`;
        super().attachShadow({ mode: "open" }).innerHTML =
          `<style>${styleApplication}</style>` +
          /* javascript */
          this.$elementHTML({
            tag: "dialog", // standard HTML <dialog>
            html:
              this.$elementHTML({
                tag: __ELEMENT_HEADER__,
                html:
                  this.$elementHTML({ tag: __ELEMENT_TOOLBAR__ }) +
                  this.$elementHTML({
                    tag: __ELEMENT_COLOR_DIALOG_SORT_GRID__,
                  }),
              }) + this.$elementHTML({ tag: __ELEMENT_COLOR_GRID__ }),
          });
      }
      // ======================================================== < app >.dialog
      get dialog() {
        return this.shadowRoot.querySelector("dialog");
      }
      // ======================================================== < app >.open
      open() {
        this.dialog.showModal();
      }
      // ======================================================== < app >.open
      close() {
        this.dialog.close();
      }
      event_colordialogstate(evt) {
        // execute this.close() or this.open() method
        this[
          {
            show: "open", // alternative for "open"
            close: "close",
            hide: "close",
          }[evt.detail] || "open"
        ]();
      }
      // ======================================================== < app >.match
      matchAllColors(hexcolor, sortDistance = __COLOR_distanceLab__) {
        hexcolor = ensureHexcolor(hexcolor);
        log("match", hexcolor);
        console.assert(this.colors.length, "No colors");

        const base16 = (x) => parseInt(x, 16);
        function colorDistanceRGB(c2) {
          var dist2 = 0;
          for (var j = 1; j < 6; j += 2) {
            dist2 +=
              (base16(hexcolor.substr(j, 2)) - base16(c2.substr(j, 2))) ** 2;
          }
          return Math.sqrt(dist2);
        }

        function colorDistanceLab(c2) {
          function RGBtoLab(RGB) {
            const f1 = (x) =>
              x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92;
            const f2 = (x) =>
              x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
            // From http://www.easyrgb.com/index.php?X=MATH&H=02#text2
            var var_R = f1(RGB[0] / 255) * 100;
            var var_G = f1(RGB[1] / 255) * 100;
            var var_B = f1(RGB[2] / 255) * 100;

            // Observer. = 2�, Illuminant = D65
            var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
            var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
            var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

            // From http://www.easyrgb.com/index.php?X=MATH&H=07#text7
            //   Observer= 2�, Illuminant= D65
            // Also http://en.wikipedia.org/wiki/Lab_color_space#Forward_transformation
            var var_X = f2(X / 95.047);
            var var_Y = f2(Y / 100.0);
            var var_Z = f2(Z / 108.883);

            var L = 116 * var_Y - 16;
            var a = 500 * (var_X - var_Y);
            var b = 200 * (var_Y - var_Z);
            return [L, a, b];
          }
          var RGB1 = [];
          var RGB2 = [];
          for (var j = 1; j < 6; j += 2) {
            RGB1.push(base16(hexcolor.substr(j, 2)));
            RGB2.push(base16(c2.substr(j, 2)));
          }
          var Lab1 = RGBtoLab(RGB1);
          var Lab2 = RGBtoLab(RGB2);
          var dist2 = 0;
          for (var i = 0; i < 3; i++) dist2 += (Lab1[i] - Lab2[i]) ** 2;
          //!if (hexcolor.includes(c2)) console.warn(hexcolor, c2, dist2);
          return Math.sqrt(dist2);
        }

        //loop all colors, calculate both RGB and Lab distance
        this.colors.map((color) => {
          let elementColors = color.colors;
          let { index, colorname, hex, hexint } = elementColors;
          let rgb = colorDistanceRGB(ensureHexcolor(hex));
          let Lab = colorDistanceLab(ensureHexcolor(hex));
          elementColors[__COLOR_distanceRGB__] = rgb.toFixed(2);
          elementColors[__COLOR_distanceLab__] = Lab.toFixed(2);
        });

        this.$emit_signal(__EVENTNAME_SORT__, sortDistance); // multiple components are listening
        this.$emit_signal("borderColor", hexcolor);
      }
      // ======================================================== < app >.event_sort
      event_sort(evt) {
        let sortOrder = evt.detail;
        this.setAttribute("sort", sortOrder);
      }
      // ======================================================== < app >.html_subdialog
      html_subdialog(color) {
        return [
          "monochrome",
          "monochrome-dark",
          "monochrome-light",
          "analogic",
          "complement",
          "analogic-complement",
          "triad",
          "quad",
        ].map(
          (name) =>
            `<img style="height:200px;width:103px;" src="https://www.thecolorapi.com/scheme?hex=${color}&format=svg&named=false&count=10&w=120&mode=${name}"/>`
        );
      }
      // ======================================================== < app >.subcolor
      subcolor(color, evt = {}) {
        console.warn(color, evt, evt.target, this);
        let subdialog = this.$query("#subdialog");
        subdialog.innerHTML = this.html_subdialog(color);
        subdialog.showModal();
        //   window.open(
        //     `https://www.thecolorapi.com/scheme?hex=${color}&format=svg&named=false&count=10&w=200&mode=complement`
        //     //`https://www.computerhope.com/cgi-bin/htmlcolor.pl?c=${color}`
        //   );
      }
      // ======================================================== < app >.colors
      get colors() {
        return [...this.shadowRoot.querySelectorAll(__ELEMENT_COLOR__)];
      }
      get colornames() {
        // the colors are sorted by CSS order, not by index
        let color_elements = this.colors;
        return color_elements.reduce((orderednames, el) => {
          orderednames[el.order] = el.colors.name;
          return orderednames;
        }, Array(color_elements.length));
      }
      // ======================================================== < app >.event_namematch
      event_namematch(evt) {
        //! on Web Component so users can act on it. Its also on the list to change opacity
        this.toggleAttribute("namematch", evt.detail);
      }
      // ======================================================== < app >.event_borderColor
      event_borderColor(evt) {
        let borderColor = evt.detail;
        let borderFontColor = this.contrastColor(borderColor);
        if (typeof borderColor == "object") {
          borderColor = evt.detail.hex;
          borderFontColor = evt.detail.contrast;
        }

        const /* function */ setCSSpropertyColor = (name, color) => {
          if (color.length == 6 || color[0] == "#") {
            color = ensureHexcolor(color);
          }
          this.style.setProperty("--" + name, color);
        };
        setCSSpropertyColor("borderColor", borderColor);
        setCSSpropertyColor("borderFontColor", borderFontColor);
        // if a DOM reference, gets its contrast color
      }
      // ======================================================== < app >.event_colormatch
      event_colormatch(evt) {
        let color = evt.detail;
        log("event_colormatch", color);
        // Events are synchronous
        // if color is a HTML Colorname, the <HCP-color> will respond with the correct Hex color value
        this.$emit_signal("matchcolorname", {
          color,
          callback: (hexcolor) => (color = hexcolor),
        });
        this.matchAllColors(color);
      }
      // ======================================================== < app >.event_storecolors
      event_storecolors(evt) {
        setTimeout(() => {
          let colors = this.colornames;
          localStorage.setItem("color-dialog", colors);
        }, 100);
      }
      // ======================================================== < app >.event_readcolors
      event_readcolors(evt) {
        log("APP event_readcolors", evt.detail);
      }
      // ======================================================== < app >.event_click
      event_click(evt) {
        //! evt.preventDefault();
        if (evt.ctrlKey && evt.altKey) this.open();
      }
      // ======================================================== < app >.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        if (this.hasAttribute("open"))
          this.$emit_signal(__EVENTNAME_DIALOG_STATE__, "open");

        setTimeout(() => {
          // wait till all innerHTML is parsed
          //! needs initial <HCP-colors> to be rendered
          let color = "#F68222";
          color = "purple";

          // this.$emit("setnamematch", "dark");
          // this.$emit(__EVENTNAME_SORT__, "index");

          //! The icons are not yet in the DOM, so we need to wait for them to be rendered
          setTimeout(() => {
            this.$emit_signal(__EVENTNAME_COLORMATCH__, color);
            // setTimeout(() => {
            //   this.$emit(
            //     __EVENTNAME_SORT__,
            //     localStorage.getItem(__ELEMENT_APP__ + "_sortOrder") ||
            //       "contrast"
            //   );
            // }, 1000);
          }, 0);

          // todo get contrastvalue for color
          log(
            `${this.nodeName} %c ${color}`,
            `background:${color};color:white`,
            "\ndispatched eventnames:",
            [...window.HTMLColorPicker_Events.values()].join(",")
          );
        });
      } // end connectedCallback < app >
    } // end class < app >
  ); // end define < app >
  // ********************************************************** <HCP-text>
  customElements.define(
    __ELEMENT_TEXT__,
    class extends BaseClass {
      // ======================================================== <HCP-toolbar>.event_borderColor
      event_borderColor(evt) {
        //! color of text set by CSS property
        // log(666,this.nodeName, "Event: borderColor", evt.detail);
        // this.style.color = this.contrastColor(
        //   typeof evt.detail == "object" ? evt.detail.hex : evt.detail
        // );
      }
      // ======================================================== <HCP-toolbar>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
      }
    }
  );

  // ********************************************************** <HCP-toolbar>
  customElements.define(
    __ELEMENT_TOOLBAR__,
    class extends BaseClass {
      // ======================================================== <HCP-toolbar>.event_borderColor
      event_borderColor(evt) {
        log(this.nodeName, "Event: borderColor", evt.detail);
      }
      // ======================================================== <HCP-toolbar>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        // add all icons to the toolbar
        this.replaceChildren(
          ...[
            "sortuser1",
            "sortindex",
            "sortrgb",
            "sortcontrast",
            "sortalfabetical",
            "sortnamelength",
            "eyedropper",
          ].map((name) =>
            this.$element({
              tag: __ELEMENT_ICON__, // <color-dialog-icon>
              title: name,
              attrs: {
                is: name, // original <svg-icon> is controlled by is="sortuser1" notation
              },
              sort: name,
            })
          )
        );
      } // end connectedCallback <HCP-toolbar>
    } // end class <HCP-toolbar>
  ); // end define <HCP-toolbar>

  // ********************************************************** <HCP-svg-icon is="">
  // copied <svg-icon> from from: https://iconmeister.github.io
  // enhanced it for color-dialog
  ((
    iconDefinitions,
    svgFunctions = { path: (d, attrs = "") => `<path d='${d}' ${attrs}/>` },
    attributes = {
      stroke: "#000",

      //rect: "<rect width='100%' height='100%' fill='{tile}' {border}/>",
      rect: "",

      fill: "black",
      tile: "none",
      img: 0,
      width: 1,
      scale: 1,
      opacity: 1,
      is: "",
      border: "",
      filter: "",
      top: "",
      v1: "",
      v2: "",
      v3: "",
      box: 9,
      rotate: 0,
      xy: 0,
      w: 0,
      h: 0,
      api: [iconDefinitions, svgFunctions],
    }
  ) =>
    customElements.define(
      __ELEMENT_ICON__,
      class extends BaseClass {
        // ======================================================== <HCP-svg-icon>.observedAttributes
        static get observedAttributes() {
          return Object.keys(attributes);
        }
        //! $notation marks the event listener to listen on this element only, not at the (document) eventbus
        // ======================================================== <HCP-svg-icon>.event_$click
        event_$click(evt) {
          if (this.sort.startsWith(__EVENTNAME_SORT__)) {
            this.$emit_signal(__EVENTNAME_SORT__, this.sort);
          } else if (this[this.sort]) {
            this[this.sort].apply(this);
          }
        }
        // ======================================================== <HCP-svg-icon>.event_sort
        event_sort(evt) {
          this.toggleAttribute("selected", this.sort === evt.detail);
        }
        // ======================================================== <HCP-svg-icon>.event_borderColor
        event_borderColor(evt) {
          this.color = this.contrastColor(
            typeof evt.detail == "object" ? evt.detail.hex : evt.detail
          );
        }
        // ======================================================== <HCP-svg-icon>.color
        set color(str) {
          this.fill = this.stroke = str;
        }
        // ======================================================== <HCP-svg-icon>.attributeChangedCallback

        attributeChangedCallback() {
          setTimeout(() => {
            //! I need to be IN the DOM for CSS properties to work
            this.svg();
          }, 0);
        }
        // ======================================================== <HCP-svg-icon>.svg
        svg(
          icon = this,
          // ------------------------------------------------------
          funcName = icon.A ||
            Object.keys((icon.A = { ...attributes })).map((attr) =>
              Object.defineProperty(
                icon,
                attr,
                {
                  set: (e) => icon.setAttribute(attr, e),
                  get: () =>
                    icon.getAttribute(attr) ||
                    getComputedStyle(icon)
                      .getPropertyValue(`--${this.localName}-` + attr)
                      .replace(/"/g, "")
                      .trim() ||
                    icon.A[attr],
                },
                (svgFunctions[attr] = (e) => ((icon.A[attr] = e), ""))
              )
            ),
          funcParameters,
          svgStr = (iconDefinitions[icon.is] || "").split`;`.map(
            (icon) => (
              ([funcName, funcParameters] = icon.trim().split`:`),
              svgFunctions[funcName]
                ? svgFunctions[funcName].apply(icon, funcParameters.split`,`)
                : icon
            )
          ).join``,
          half = icon.box / 2,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${icon.w || icon.box
            } ${icon.h || icon.box}' style='vertical-align:top'>${icon.rect
            }<g stroke-width='{width}' stroke='{stroke}' fill='{fill}' opacity='{opacity}' filter='{filter}' transform='translate({xy}) matrix({scale} 0 0 {scale} ${half - half * icon.scale
            } ${half - half * icon.scale
            }) rotate({rotate} ${half} ${half})'>${svgStr}</g>${icon.top
            }</svg>`.replace(
              /{\s?([^{}\s]*)\s?}/g,
              (_, property) => icon[property] // string replace all {x} with property x on icon
            )
        ) {
          // ------------------------------------------------------
          // this replaces the whole Web Component
          return icon.img
            ? this.replaceChildren(
              this.$element({
                tag: "img",
                src: "data:image/svg+xml," + svg.replace(/#/g, "%23"),
                //! can't do events that trigger redraw here
                // onmouseenter: (evt) => (this.stroke = "green"),
              })
            )
            : (this.innerHTML = svg);
          // original https://iconmeister.github.io code:
          // return (icon.innerHTML =
          //   1 == icon.img
          //     ? `<img style='vertical-align:top' src="data:image/svg+xml,${svg.replace(
          //         /#/g,
          //         "%23"
          //       )}">`
          //     : svg);
        }
      }
    ))({
      // ------------------------------------------------------
      sortindex:
        "box:64;fill:#000;width:.01;path:m38 12h2v8h-2a2 2 90 00-2 2v4a2 2 90 002 2h12a2 2 90 002-2v-4a2 2 90 00-2-2h-2v-14a2 2 90 00-2-2h-6a2 2 90 00-2 2l-2 4a2 2 90 002 2m-15 32h-6v-38a2 2 90 00-2-2h-4a2 2 90 00-2 2v38h-6c-2 0-3 3-2 4l10 12a2 2 90 003 0l10-12c2-1 1-4-2-4z",
      sortnamelength:
        "box:512;fill:#000;width:.1;path:M240 96h64a16 16 0 0016-16v-32a16 16 0 00-16-16h-64a16 16 0 00-16 16v32a16 16 0 0016 16zM240 254h128a16 16 0 0016-16v-32a16 16 0 00-16-16h-128a16 16 0 00-16 16v32a16 16 0 0016 16zM240 415h192a16 16 0 0016-16v-32a16 16 0 00-16-16h-192a16 16 0 00-16 16v32a16 16 0 0016 16zM176 352h-48v-304a16 16 0 00-16-16h-32a16 16 0 00-16 16v304h-48c-14 0-21 17-11 27l80 96a16 16 0 0023 0l80-96c9-10 2-27-12-27z",
      sortalfabetical:
        "box:512;fill:#000;width:0;path:m176 352h-48v-304a16 16 0 00-16-16h-32a16 16 0 00-16 16v304h-48c-14 0-21 17-11 27l80 96a16 16 0 0022 0l80-96c10-10 3-27-11-27zm271-149-59-160a16 16 0 00-15-11h-42a16 16 0 00-15 11l-59 160a16 16 0 0015 21h25a16 16 0 0015-11l4-13h71l5 13a16 16 0 0015 11h25a16 16 0 0015-21zm-111-59 16-48 16 48z",
      sortrgb:
        "box:32;fill:#000;<circle cx='10' cy='12' r='2'/><circle cx='16' cy='9' r='2'/><circle cx='22' cy='12' r='2'/><circle cx='23' cy='19' r='2'/>;path:m17 2a14 14 0 00-15 14 5 5 0 006 5l1 0a3 3 0 014 2v4a3 3 0 003 3 14 14 0 0014-15 14 14 0 00-13-13zm8 22a12 12 0 01-9 4 1 1 0 01-1-1v-4a5 5 0 00-5-5 5 5 0 00-1 0l-1 0a3 3 0 01-4-2 12 12 0 0112-12 12 12 0 0112 12 12 12 0 01-3 8z",
      sortcontrast:
        "box:240;fill:#000;path:m177 80-57-57-57 56c-31 31-31 82 0 113a80 80 90 0057 24c21 0 41-8 57-23 31-31 31-82 0-113zm-57 116c-16 0-31-6-42-18-12-11-18-26-18-42s6-31 18-42l42-43v145z",
      sortuser1:
        "box:32;path:m16 2a14 14 0 1014 14 14 14 0 00-14-14zm8 23v-1l0 0a5 5 0 00-5-5h-6a5 5 0 00-5 5c0 0 0 0 0 0v1a12 12 0 1116 0zm-8-18a5 5 0 105 5 5 5 0 00-5-5z",
      eyedropper:
        "box:32;fill:black;path:m2 27h3v3h-3zm27.7-19.7-5-5a1 1 0 00-1.4 0h0l-3.3 3.3-1.3-1.3-1.4 1.4 1.3 1.3-10.3 10.3a1 1 0 00-.3.7v1.6l-2.7 2.7a1 1 0 000 1.4h0l3 3a1 1 0 001.4 0h0l2.7-2.7h1.6a1 1 0 00.7-.3l10.3-10.3 1.3 1.3 1.4-1.4-1.3-1.3 3.3-3.3a1 1 0 000-1.4zm-16.1 14.7h-2l-2.6 2.6-1.6-1.6 2.6-2.6v-2l10-10 3.6 3.6zm11.4-11.4-3.6-3.6 2.6-2.6 3.6 3.6z",
    }); // end define <svg-icon> adapted from https://iconmeister.github.io

  //end IIFE
})();

// Advantages
// It is easy to implement yet unwritten code, core code can dispatch events, future components will handle them without requiring any change to the core code.

// Disadvantages
// It is easy to dispatch too many unrequired events, or none existing eventNames
