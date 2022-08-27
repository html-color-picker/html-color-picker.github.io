!(function () {
  // 7 x 16 square grid, transposed to diagonal presentation:
  //  00  02  05  09  14  20  27
  //  01  04  08  13  19  26  34
  //  03  07  12  18  25  33  41
  //  06  11  17  24  32  40  48
  //  10  16  23  31  39  47  55
  //  15  22  30  38  46  54  62
  //  21  29  37  45  53  61  69
  //  28  36  44  52  60  68  76
  //  35  43  51  59  67  75  83
  //  42  50  58  66  74  82  90
  //  49  57  65  73  81  90  97
  //  56  64  72  80  88  96
  //  63  71  79  87  95
  //  70  78  86  94 102
  //  77  85  93 101
  //  84  92 100
  //  91  99
  //  98
  //  105
  //  112
  //  119
  //  126
  //  133
  let diagonal = [
    0, 7, 1, 14, 8, 2, 21, 15, 9, 3, 28, 22, 16, 10, 4, 35, 29, 23, 17, 11, 5,
    42, 36, 30, 24, 18, 12, 6, 49, 43, 37, 31, 25, 19, 13, 56, 50, 44, 38, 32,
    26, 20, 63, 57, 51, 45, 39, 33, 27, 70, 64, 58, 52, 46, 40, 34, 77, 71, 65,
    59, 53, 47, 41, 84, 78, 72, 66, 60, 54, 48, 91, 85, 79, 73, 67, 61, 55, 98,
    92, 86, 80, 74, 68, 62, 105, 99, 93, 87, 81, 75, 69, 112, 106, 100, 94, 88,
    82, 76, 119, 113, 107, 101, 95, 89, 83, 126, 120, 114, 108, 102, 96, 90,
    133, 127, 121, 115, 109, 103, 97, 134, 128, 122, 116, 110, 104, 135, 129,
    123, 117, 111, 136, 130, 124, 118, 137, 131, 125, 138, 132, 139,
  ];
  const __EVENTNAME__ = "🎨";
  const __ELEMENT_APP__ = "color-dialog";
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

  const __EVENT_COLOR_DRAG = "colordrag";

  // ********************************************************** log function
  function log(...args) {
    let label = args.shift();
    console.log(
      `%c ${label} `,
      `background:${__APP_COLOR__};color:gold`,
      ...args
    );
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
  // ********************************************************** ACME_BaseElement
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
    // ======================================================== ACME_BaseElement.$elementHTML
    $elementHTML({
      tag = "div", // HTML tag name
      html = "",
      attrs = "",
    }) {
      return `<${tag} ${attrs}>${html}</${tag}>`;
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
        ? this.$query(tag) // do not create a new tag, find existing element
        : document.createElement(tag), // else create a new tag
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

      // add listener to remove all eventlisteners on element
      element.addEventListener(
        new CustomEvent("removeEventListeners"),
        (evt) => {
          element.removeEventListeners(evt);
        }
      );
      return element;
    }
    // ======================================================== ACME_BaseElement.disconnectedCallback
    disconnectedCallback() {
      console.warn("" + this.tagName + " disconnected");
    }
    // ======================================================== ACME_BaseElement.eventbus
    get eventbus() {
      return this.__eventbus__ || document;
    }
    // ======================================================== ACME_BaseElement.connectedCallback
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
              scope.$listen({
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

  // ********************************************************** ACME_BaseElement

  // ********************************************************** HTMLColorDialogBaseElement
  class HTMLColorDialogBaseElement extends ACME_BaseElement {
    //! no connectedCallback defined, calls super.connectedCallback() by default!
    // connectedCallback() {
    //   super.connectedCallback();
    // }
    // ======================================================== HTMLColorDialog BaseElement.sorts
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
    // ======================================================== HTMLColorDialog BaseElement.eyedropper
    eyedropper() {
      this.$emit("colordialogstate", "close");
      if (!window.EyeDropper) {
        console.warn("Your browser does not support the EyeDropper API");
        this.$emit(
          "colordialogtoast",
          "Your browser does not support the EyeDropper API"
        );
        return;
      }
      const eyeDropper = new EyeDropper();
      eyeDropper
        .open()
        .then((result) => {
          this.$emit("colordialogstate", "open");
          this.$emit("colormatch", result.sRGBHex);
        })
        .catch((e) => {
          console.log("eyedropper canceled", e);
        });
    }
    // ======================================================== HTMLColorDialog BaseElement.colors
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
        `aliceblue,powderblue,thistle,mediumslateblue,royalblue,fuchsia,indigo,` +
        `ghostwhite,lightblue,plum,mediumpurple,slateblue,magenta,darkviolet,` +
        `lavender,pink,violet,orchid,mediumorchid,mediumvioletred,purple,` +
        `lavenderblush,lightpink,hotpink,palevioletred,deeppink,crimson,darkmagenta`
      );
    }
    // ======================================================== HTMLColorDialog BaseElement.rgb2hex
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
    // ======================================================== HTMLColorDialog BaseElement.contrastColor
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

  // ********************************************************** <cd-label>
  customElements.define(
    __ELEMENT_LABEL__,
    class extends HTMLColorDialogBaseElement {
      // ======================================================== <cd-label>.event_click
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

  // ********************************************************** <cd-color>
  customElements.define(
    __ELEMENT_COLOR__,
    class extends HTMLColorDialogBaseElement {
      // ======================================================== <cd-color>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        if (this.initialized) return; // connectedCallback runs every time it is added AND MOVED in the DOM
        this.initialized = true;

        this.render();
      }
      // ======================================================== <cd-color>.set order
      set order(n) {
        this.style.setProperty("order", n);
      }
      get order() {
        return this.style.getPropertyValue("order");
      }
      // ======================================================== <cd-color>.set name
      set name(n) {
        this.querySelector("." + __COLOR_name__).textContent = n;
      }
      // ======================================================== <cd-color>.set hex
      set hex(h) {
        this.querySelector("." + __COLOR_hex__).textContent = h;
      }
      // ======================================================== <cd-color>.set color
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
      // ======================================================== <cd-color>.event_$click
      event_$click(evt) {
        // todo special ctrlKey event notation?
        //if (evt.ctrlKey)
        this.$emit("colormatch", this.colors.hex);
      }
      //! event_ handlers configured automagically in BaseElement
      // ======================================================== <cd-color>.event_namematch
      // Every <cd-color> listens to every "namematch" event, to match by name
      event_namematch(evt) {
        const namematch = evt.detail;
        if (namematch) {
          const toggleState =
            this.id.includes(namematch) || this.colors.hex.includes(namematch);
          this.classList.toggle("namematched", toggleState);
        } else {
          this.classList.remove("namematched"); //todo required, toggle does it?
        }
      }
      // ======================================================== <cd-color>.event_matchcolorname
      event_matchcolorname(evt) {
        if (this.id == evt.detail.color) {
          log(
            `YEAH! I AM %c ${this.id}`,
            `background:${this.id};color:${this.colors.contrast}`
          );
          evt.detail.callback(this.colors.hex);
        }
      }
      // ======================================================== <cd-color>.event_colormatch
      //! event_namematch doesn't fire on colormatch, remove namematched class
      event_colormatch(evt) {
        this.classList.remove("namematched");
        // set opacity according to distance from match color
        // console.error("fading opacity",this.colors.contrastValue);
      }
      // ======================================================== <cd-color>.event_indexmatch
      event_indexmatch(evt) {
        console.log(this);
        if (evt.detail.indexmatch == this.index) {
          this.color = evt.detail.color;
        }
      }
      // ======================================================== <cd-color>.render
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
        this.color = this.id;
        this.initdrag();
      }
      // ======================================================== <cd-color>.initdrag
      initdrag() {
        this.initdrag = () => {}; //! overload initdrag, so it runs only once

        this.setAttribute("draggable", true);
        const /* function */ dispatch = (detail) =>
            this.$dispatch({ name: "colordialogdrag", detail });

        Object.assign(this, {
          ondragstart: (evt) => {
            dispatch({
              dragcolor: this,
            });
          },
          ondragenter: (evt) => {
            log(this.id);
          },
          ondragleave: (evt) => {},
          ondragover: (evt) => {
            dispatch({
              dragover: this,
            });
          },
          ondragend: (evt) => {
            dispatch({
              dragover: undefined,
            });
          },
        });
      }
      // ======================================================== <cd-color>.swapwith
      swapwith(color) {
        let saveorder = this.order;
        this.order = color.order;
        color.order = saveorder;
      }
    }
  );

  // ********************************************************** <CD-color-grid>
  customElements.define(
    __ELEMENT_COLOR_GRID__,
    class extends HTMLColorDialogBaseElement {
      // ======================================================== <CD-color-grid>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        this.drag = {};
        this.render();
      } //connectedCallback
      // ======================================================== <CD-color-grid>.render
      render() {
        let colors =
          this.getAttribute("colors") || HTMLColorDialogBaseElement.colors;
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
              order: index, //! <cd-color> are not redrawn! Positioning is with CSS order:index
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
      // ======================================================== <CD-color-grid>.orderDiagonal
      orderDiagonal() {
        setTimeout(() => {
          this.childNodes.forEach((cdc) => {
            let order = cdc.order;
            let column = order % 7;
            let row = Math.floor(order / 7);
            //cdc.hex = order + " / " + diagonal[order];
            cdc.order = diagonal[order];
          });
        });
      }
      // ======================================================== <CD-color-grid>.sort
      sort(sortOrder = this.getAttribute("sort") || "index") {
        this.elements
          // get the wanted sortOrder Function from .sorts
          .sort(HTMLColorDialogBaseElement.sorts[sortOrder])
          // change all CSS order settings
          .map((element, idx) => {
            element.order = idx;
            //element.hex = idx; // display idx, not color hex value
            //return element;
          });

        log(`${this.nodeName} sorted:%c ${sortOrder}`, "background:gold");
      } // render
      // ======================================================== <CD-color-grid>.event_colormatch
      event_colormatch(evt) {
        this.toggleAttribute("namematch", false);
      }
      // ======================================================== <CD-color-grid>.event_namematch
      event_namematch(evt) {
        this.toggleAttribute("namematch", evt.detail);
      }
      // ======================================================== <CD-color-grid>.event_sort
      event_sort(evt) {
        let sortOrder = evt.detail.replace("sort", ""); // strip from "sortindex"
        log(this.nodeName + " sorting", sortOrder);
        this.sort(sortOrder);
        if (sortOrder != "index") {
          this.orderDiagonal();
        }
      }
      // ======================================================== <CD-color-grid>.event_colordialogdrag
      event_colordialogdrag(evt) {
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
            this.$emit("storecolors");
          }
        }
      } // event_colordialogdrag
    }
  );

  // ********************************************************** <CD-sort-grid>
  customElements.define(
    __ELEMENT_COLOR_DIALOG_SORT_GRID__,
    class extends HTMLColorDialogBaseElement {
      // ======================================================== <CD-sort-grid>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        this.render();
      } //connectedCallback
      // ======================================================== <CD-sort-grid>.event_sort
      event_sort(evt) {
        let sortOrder = evt.detail;
        log(this.nodeName + " SORT", sortOrder);
        this.setAttribute("sort", sortOrder); // so it can be used in CSS selectors
        this.$query("select").value = sortOrder;
      }
      // ======================================================== <CD-sort-grid>.event_setnamematch
      event_setnamematch(evt) {
        this.inputElement.value = evt.detail;
        this.inputElement.dispatchEvent(new Event("keyup"));
      }
      // ======================================================== <CD-sort-grid>.input_namematch
      input_namematch(namematch = "") {
        // this.$emit("attribute_namematch", namematch);
        //this.$emit("borderColor", __APP_COLOR__);
        this.$emit("namematch", { namematch: false });
        // if ABCDEF highlight nearest colors
        if (namematch.length == 6) {
          console.log("ABCDEF", namematch);
          // this.$emit("attribute_namematch", false);
          this.$emit("colormatch", namematch);
        } else {
          console.warn("Match use input", namematch);
          this.$emit("namematch", namematch);
        }
      }
      // ======================================================== <CD-sort-grid>.render
      render() {
        this.inputElement = this.$element({
          tag: "input",
          attrs: {
            type: "text",
          },
          onkeyup: (evt) => this.input_namematch(evt.target.value),
        }); // inputElement
        this.replaceChildren(
          this.$element({
            tag: "select",
            onchange: (evt) => {
              this.$dispatch({
                name: "sort",
                detail: evt.target.value,
              });
            },
            // add <option>s
            append: Object.entries(HTMLColorDialogBaseElement.sorts).map(
              ([key, func]) =>
                this.$element({
                  tag: "option",
                  value: key,
                  innerText: key,
                })
            ),
          }),
          this.inputElement
        ); // append
      } // render
    } // class
  ); // define <CD-sort-grid>

  // ********************************************************** <color-dialog>
  customElements.define(
    __ELEMENT_APP__,
    class extends HTMLColorDialogBaseElement {
      // ======================================================== <color-dialog>.constructor
      constructor() {
        super().attachShadow({ mode: "open" }).innerHTML =
          /* html  */ `<style>` +
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
          // dim all cd-colors when searching for a namematch
          /* css  */ `${__ELEMENT_COLOR_GRID__}[namematch] ${__ELEMENT_COLOR__}:not(.namematched){opacity:.3}` +
          // footer
          /* css  */ `dialog::after{content:"<html-color-dialog> by Roads Technology";color:beige;font-size:70%;position:fixed;}` +
          // toolbar //
          /* css  */ `${__ELEMENT_TOOLBAR__}{display:flex;gap:5px;justify-content:start;width:100%;height:30px;cursor:pointer;}` +
          // size toolbar buttons //
          /* css  */ `${__ELEMENT_ICON__}{width:24px;height:24px}` +
          /* css  */ `${__ELEMENT_HEADER__}{display:grid;grid:1fr/250px 1fr 50px;background:var(--borderColor,beige)}` +
          `</style>` +
          this.$elementHTML({
            tag: "dialog", // standard HTML <dialog>
            html:
              this.$elementHTML({
                tag: __ELEMENT_HEADER__, // <color-dialog-header>
                html:
                  this.$elementHTML({ tag: __ELEMENT_TOOLBAR__ }) + // <color-dialog-toolbar>
                  this.$elementHTML({
                    tag: __ELEMENT_COLOR_DIALOG_SORT_GRID__, // <color-dialog-sort-list>
                  }) +
                  `<input type="checkbox" class="opener" />
                    <nav>
                    <a href="#home">Home</a> <a href="#about">About</a>
                    <a href="#contacts">Contacts</a>
                    </nav>
                    <style>
                    input.opener: checked + nav { display: block;
                    }
                    input.opener{ appearance: none; }
                    input.opener::after {
                    content: "="
                    }
                    </style>`,
              }) + this.$elementHTML({ tag: __ELEMENT_COLOR_GRID__ }), // <color-dialog-color-grid>
          });
      }
      // ======================================================== <color-dialog>.dialog
      get dialog() {
        return this.shadowRoot.querySelector("dialog");
      }
      // ======================================================== <color-dialog>.open
      open() {
        this.dialog.showModal();
      }
      // ======================================================== <color-dialog>.open
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
      // ======================================================== <color-dialog>.match
      match(hexcolor, sortDistance = __COLOR_distanceLab__) {
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
          //console.log(index, colorname, rgb, Lab,elementColors.hex, elementColors);
          elementColors[__COLOR_distanceRGB__] = rgb.toFixed(2);
          elementColors[__COLOR_distanceLab__] = Lab.toFixed(2);
        });

        this.$emit("sort", sortDistance); // multiple components are listening
        console.error("sorted by distance");
        this.$emit("borderColor", hexcolor);
      }
      // ======================================================== <color-dialog>.event_sort
      event_sort(evt) {
        let sortOrder = evt.detail;
        console.warn(this.nodeName, "sort:", sortOrder);
        this.setAttribute("sort", sortOrder);
      }
      // ======================================================== <color-dialog>.html_subdialog
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
      // ======================================================== <color-dialog>.subcolor
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
      // ======================================================== <color-dialog>.colors
      get colors() {
        return [...this.shadowRoot.querySelectorAll(__ELEMENT_COLOR__)];
      }
      get colornames() {
        return this.colors.map((col) => col.colors.name).join(",");
      }
      // ======================================================== <color-dialog>.listnames
      listnames() {
        console.log(this.colornames);
      }
      // ======================================================== <color-dialog>.event_namematch
      event_namematch(evt) {
        //! on Web Component so users can act on it. Its also on the list to change opacity
        this.toggleAttribute("namematch", evt.detail);
      }
      // ======================================================== <color-dialog>.event_borderColor
      event_borderColor(evt) {
        let borderColor = evt.detail;
        let borderFontColor = "beige";
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
        //setCSSpropertyColor("borderFontColor", borderFontColor);
        // if a DOM reference, gets its contrast color
      }
      // ======================================================== <color-dialog>.event_colormatch
      event_colormatch(evt) {
        let color = evt.detail;
        log("event_colormatch", color);
        // Events are synchronous
        // if color is a HTML Colorname, the <cd-color> will respond with the correct Hex color value
        this.$emit("matchcolorname", {
          color,
          callback: (hexcolor) => (color = hexcolor),
        });
        this.match(color);
      }
      // ======================================================== <color-dialog>.event_storecolors
      event_storecolors(evt) {
        localStorage.setItem("color-dialog", this.colornames);
      }
      // ======================================================== <color-dialog>.event_readcolors
      event_readcolors(evt) {
        console.error(evt.type, evt.target.nodeName);
        let colors = localStorage.getItem("color-dialog");
      }
      // ======================================================== <color-dialog>.event_click
      event_click(evt) {
        //! evt.preventDefault();
        if (evt.ctrlKey && evt.altKey) this.open();
      }
      // ======================================================== <color-dialog>.connectedCallback
      connectedCallback() {
        super.connectedCallback();
        if (this.hasAttribute("open")) this.$emit("colordialogstate", "open");

        setTimeout(() => {
          // wait till all innerHTML is parsed
          //! needs initial <cd-colors> to be rendered
          let color = "#F68222";
          color = "red";
          this.$emit("colormatch", color);
          this.$emit("storecolors");
          this.$emit("readcolors");
          // this.$emit("setnamematch", "dark");
          // this.$emit("sort", "index");
          // todo get contrastvalue for color
          log(
            `${this.nodeName} %c ${color}`,
            `background:${color};color:white`,
            "\ndispatched eventnames:",
            [...window.ColorDialogEvents.values()].join(",")
          );
        });
      } // end connectedCallback <color-dialog>
    } // end class <color-dialog>
  ); // end define <color-dialog>
  // ********************************************************** <CD-toolbar>
  customElements.define(
    __ELEMENT_TOOLBAR__,
    class extends HTMLColorDialogBaseElement {
      // ======================================================== <CD-toolbar>.event_borderColor
      event_borderColor(evt) {
        log(this.nodeName, "Event: borderColor", evt.detail);
      }
      // ======================================================== <CD-toolbar>.connectedCallback
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
      } // end connectedCallback <CD-toolbar>
    } // end class <CD-toolbar>
  ); // end define <CD-toolbar>

  // ********************************************************** <CD-svg-icon is="">
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
      class extends HTMLColorDialogBaseElement {
        // ======================================================== <CD-svg-icon>.observedAttributes
        static get observedAttributes() {
          return Object.keys(attributes);
        }
        //! $notation marks the event listener to listen on this element only, not at the (document) eventbus
        // ======================================================== <CD-svg-icon>.event_$click
        event_$click(evt) {
          if (this.sort.startsWith("sort")) {
            this.$emit("sort", this.sort);
          } else if (this[this.sort]) {
            this[this.sort].apply(this);
          }
        }
        // ======================================================== <CD-svg-icon>.event_sort
        event_sort(evt) {
          this.toggleAttribute("selected", this.sort === evt.detail);
        }
        // ======================================================== <CD-svg-icon>.event_borderColor
        event_borderColor(evt) {
          this.color = this.contrastColor(
            typeof evt.detail == "object" ? evt.detail.hex : evt.detail
          );
        }
        // ======================================================== <CD-svg-icon>.color
        set color(str) {
          this.fill = this.stroke = str;
        }
        // ======================================================== <CD-svg-icon>.attributeChangedCallback

        attributeChangedCallback() {
          setTimeout(() => {
            //! I need to be IN the DOM for CSS properties to work
            this.svg();
          }, 0);
        }
        // ======================================================== <CD-svg-icon>.svg
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
          svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${
            icon.w || icon.box
          } ${icon.h || icon.box}' style='vertical-align:top'>${
            icon.rect
          }<g stroke-width='{width}' stroke='{stroke}' fill='{fill}' opacity='{opacity}' filter='{filter}' transform='translate({xy}) matrix({scale} 0 0 {scale} ${
            half - half * icon.scale
          } ${
            half - half * icon.scale
          }) rotate({rotate} ${half} ${half})'>${svgStr}</g>${
            icon.top
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
