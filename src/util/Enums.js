export const THRESHOLD = -Math.log10(5e-8)

export const CHROMOSOMES = [...Array(23).keys().map(chr => chr + 1)]

export const GREYS = [
  '#757272',
  '#262525'
]

export const COLORS = [
  '#1f77b4',  //muted blue
  '#ff7f0e',  //safety orange
  '#2ca02c',  //cooked asparagus green
  '#d62728',  //brick red
  '#9467bd',  //muted purple
  '#8c564b',  //chestnut brown
  '#e377c2',  //raspberry yogurt pink
  '#7f7f7f',  //middle gray
  '#bcbd22',  //curry yellow-green
  '#17becf',  //blue-teal
  ]

  //from https://www.ncbi.nlm.nih.gov/grc/human/data Human Genome Assembly GRCh38.p14
  export const GRC38_P14_CHROMOSOME_LENGTHS = {
    1: 248956422,
    2: 242193529,
    3: 198295559,
    4: 190214555,
    5: 181538259,
    6: 170805979,
    7: 159345973,
    8: 145138636,
    9: 138394717,
    10: 133797422,
    11: 135086622,
    12: 133275309,
    13: 114364328,
    14: 107043718,
    15: 101991189,
    16: 90338345,
    17: 83257441,
    18: 80373285,
    19: 58617616,
    20: 64444167,
    21: 46709983,
    22: 50818468,
    23: 156040895, //X Chromosome
    24: 57227415 //Y Chromosome
  }