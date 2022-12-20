/**
 * chart_id: must be the id of the empty div where you want to put the chart
 * data: must be a dictionart {label_name: count, label_name2: count2, ...}
 * height: it has to be like '200px' or '20rem' or '50%'
 * width: same as height
 * *_color: specify the color of a component in the chart 
 */
class Barchart {
  constructor(chart_id, data, height=null, width=null, 
    bg_color='white', axis_color='black', label_color='black',
    bar_color='dodgerblue', grid_color='lightgray') {
    this.chart_id = chart_id;
    this.data = data;
    this.height = height;
    this.width = width;
    this.bg_color = bg_color;
    this.axis_color = axis_color;
    this.label_color = label_color;
    this.bar_color = bar_color;
    this.grid_color = grid_color;
  }

  get_style = () => {
    // There must not be empty space between any color and ':' 
    return `
    chart_id_placeholder {
      background-color:${this.bg_color};
      width: 600px;
      height: 400px;
      position: relative;
    }
    #axis-x, #axis-y {
      background-color:${this.axis_color};
      position: absolute;
      left: 5%;
    }
    #axis-x {
      width: 90%;
      height: 3px;
      bottom: 15%;
    }
    #axis-y {
      height: 90%;
      width: 3px;
      bottom: 5%;
    }
    #axis-x-labels, #axis-y-labels {
      color:${this.label_color};
      font-size: 16px;
    }
    #axis-x-labels {
      width: 85%;
      height: 10%;
      position: absolute;
      left: calc(5% + 3px);
      bottom: 5%;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
    }
    .axis-x-label {
      width: 5%;
      height: 40%;
    }
    #axis-y-labels {
      width: 5%;
      height: 75%;
      position: absolute;
      left: 0;
      bottom: calc(15% + 3px);
    }
    #axis-y-labels::before {
      content: '#';
      position: absolute;
      top: -5%;
      right: 20%;
      font-weight: bold;
      font-size: 20px;
      color:${this.axis_color};
    }
    
    #chart-face {
      position: absolute;
      bottom: calc(15% + 3px);
      left: calc(5% + 3px);
      width: 85%;
      height: 75%;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
    }
    .chart-bar {
      background-color:${this.bar_color};
      z-index: 100;
    }
    .chart-bar-label {
      margin-top: -21px;
      font-size: 17px;
      z-index: 99;
      font-weight: bold;
      color:${this.label_color};
      background-color:${this.bg_color};
    }
    .h-line {
      height: 1px;
      background-color:${this.grid_color};
      position: absolute;
      width: 100%;
    }
    `.replaceAll(' #', ` #${this.chart_id}-`)
     .replaceAll(' .', ` .${this.chart_id}-`)
     .replace(`chart_id_placeholder`, `#${this.chart_id}`); 
  }

  build = () => {
    const keys = Object.keys(this.data);
    const values = Object.values(this.data);
    // Get max and min in values
    const max_value = values.reduce((v, curr) => {
                          if (v > curr) return v;
                          return curr;
                      }, values[0]);
    const min_value = values.reduce((v, curr) => {
                          if (v < curr) return v;
                          return curr;
                      }, values[0]);
    const num_bars = keys.length;
    // Build div
    const chart = document.querySelector(`#${this.chart_id}`);
    if (this.height) chart.style.height = `${this.height}`;
    if (this.width) chart.style.width = `${this.width}`;
    const markup = `
    <span id="${this.chart_id}-axis-x"></span>
    <div id="${this.chart_id}-axis-x-labels"></div>
    <span id="${this.chart_id}-axis-y"></span>
    <div id="${this.chart_id}-axis-y-labels"></div>
    <div id="${this.chart_id}-chart-face"></div>
    `;
    chart.insertAdjacentHTML('afterbegin', markup);
    // DOMs
    const chart_face = document.querySelector(`#${this.chart_id}-chart-face`);
    const chart_x_axis = document.querySelector(`#${this.chart_id}-axis-x-labels`);
    const chart_y_axis = document.querySelector(`#${this.chart_id}-axis-y-labels`);
    // Insert grid horizontal lines
    const unique_values = new Set(values);
    unique_values.forEach( v => {
      if (v == 0) return;
      const h_line_height = v / max_value * 100;
      const h_line_style = `left: 0; bottom: calc(${h_line_height}% - 1px);`;
      const h_line = `<span class="${this.chart_id}-h-line" style="${h_line_style}"></span>`;
      chart_face.insertAdjacentHTML('afterbegin', h_line);
    });
    // Populate charts with bars
    keys.forEach( (key, i) => {
      const bar_height = values[i] / max_value * 100;
      const bar_width = 100 / num_bars / 2;
      const bar_style = `left: ${bar_width*(i+1)}%; height: ${bar_height}%; width: ${bar_width}%`;
      let bar = `
      <div class="${this.chart_id}-chart-bar" id="${this.chart_id}-chart-bar-${i}" style="${bar_style}">
        <p class="${this.chart_id}-chart-bar-label">${values[i]}</p>
      </div>
      `;
      chart_face.insertAdjacentHTML('beforeend', bar);
      chart_x_axis.insertAdjacentHTML('beforeend', `<p class="${this.chart_id}-axis-x-label">${key}</p>`);
    });
    // Add style to HTML
    document.querySelector('head').insertAdjacentHTML('beforeend', `<style>${this.get_style()}</style>`)
  }
}