const data = {
  '1': 3,
  '2': 1,
  '3': 5,
  '4': 0,
  '5': 7,
  '6': 20,
  '7': 2,
  '8': 3,
  '9': 1,
  '10': 2
}
const data2 = {
  'cane': 5,
  'gatto': 0,
  'giraffa': 2,
  'leone': 1,
  'aquila': 3,
  'pesce': 2,
  'gazzella': 2,
  'coniglio': 8
}
const data3 = {
  'yes': 254,
  'no': 127
}
const data4 = {
  '1': 3,
  '2': 1,
  '3': 5,
  '4': 0,
  '5': 7,
  '6': 20,
  '7': 2,
  '8': 3,
  '9': 1,
  '10': 2,
  '11': 3,
  '12': 1,
  '13': 5,
  '14': 0,
  '15': 7,
  '16': 10,
  '17': 2,
  '18': 3,
  '19': 1,
  '20': 2
}

class Barchart {
  constructor(chart_id, data, height=null, width=null, axis_x_title='',
    bg_color='white', axis_color='black', label_color='black',
    bar_color='dodgerblue', grid_color='lightgray') {
    this.chart_id = chart_id;
    this.data = data;
    this.height = height;
    this.width = width;
    this.axis_x_title = axis_x_title;
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
    #axis-x-title {
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      color:${this.axis_color};
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
      text-align: center;
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
    <span id="${this.chart_id}-axis-x">     
    </span>
    <div id="${this.chart_id}-axis-x-labels">
      <p id="${this.chart_id}-axis-x-title">${this.axis_x_title}</p>
    </div>
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

const barchart = new Barchart(
  'chartid1', data, height='300px', width='800px'
);
barchart.build();

const barchart2 = new Barchart(
  'chartid2', data2, height='400px', width='700px', axis_x_title='Animals',
  bg_color='black', axis_color='white', label_color='white'
);
barchart2.build();

const barchart3 = new Barchart(
  'chartid3', data3, height='400px', width='550px', axis_x_title='Disagree', 
  bg_color='#ffeecc' 
);
barchart3.build();

const barchart4 = new Barchart(
  'chartid4', data4
);
barchart4.build();
