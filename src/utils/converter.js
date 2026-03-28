const unitFactorsByCategory = {
  angle: {
    deg: Math.PI / 180,
    rad: 1,
    grad: Math.PI / 200,
    arcmin: Math.PI / 10800,
    arcsec: Math.PI / 648000,
  },
  area: {
    'm2': 1,
    'km2': 1_000_000,
    'cm2': 0.0001,
    'mm2': 0.000001,
    ha: 10_000,
    acre: 4046.8564224,
    'ft2': 0.09290304,
    'in2': 0.00064516,
  },
  bitsBytes: {
    b: 1,
    Kb: 1000,
    Mb: 1_000_000,
    Gb: 1_000_000_000,
    Tb: 1_000_000_000_000,
    B: 8,
    KB: 8000,
    MB: 8_000_000,
    GB: 8_000_000_000,
    TB: 8_000_000_000_000,
    KiB: 8192,
    MiB: 8_388_608,
    GiB: 8_589_934_592,
  },
  density: {
    'kg/m3': 1,
    'g/cm3': 1000,
    'g/mL': 1000,
    'lb/ft3': 16.018463,
    'lb/in3': 27679.90471,
  },
  electricCurrent: {
    A: 1,
    mA: 0.001,
    uA: 0.000001,
    kA: 1000,
  },
  energy: {
    J: 1,
    kJ: 1000,
    cal: 4.184,
    kcal: 4184,
    Wh: 3600,
    kWh: 3_600_000,
    eV: 1.602176634e-19,
    BTU: 1055.05585262,
  },
  force: {
    N: 1,
    kN: 1000,
    dyne: 0.00001,
    lbf: 4.4482216153,
    kgf: 9.80665,
  },
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
    nmi: 1852,
  },
  mass: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    t: 1000,
    lb: 0.45359237,
    oz: 0.028349523125,
    stone: 6.35029318,
  },
  power: {
    W: 1,
    kW: 1000,
    MW: 1_000_000,
    hp: 745.699872,
    'BTU/h': 0.29307107,
  },
  pressure: {
    Pa: 1,
    kPa: 1000,
    bar: 100000,
    psi: 6894.757293,
    atm: 101325,
    mmHg: 133.322368,
    torr: 133.322368,
  },
  speed: {
    'm/s': 1,
    'km/h': 0.2777777778,
    mph: 0.44704,
    'ft/s': 0.3048,
    knot: 0.5144444444,
  },
  time: {
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    day: 86400,
    week: 604800,
    month: 2629800,
    year: 31557600,
  },
  volume: {
    'm3': 1,
    L: 0.001,
    mL: 0.000001,
    'cm3': 0.000001,
    'ft3': 0.028316846592,
    'in3': 0.000016387064,
    'gal(US)': 0.003785411784,
    'gal(UK)': 0.00454609,
  },
}

export const converterCategories = [
  { value: 'angle', label: 'Angle' },
  { value: 'area', label: 'Area' },
  { value: 'bitsBytes', label: 'Bits & Bytes' },
  { value: 'density', label: 'Density' },
  { value: 'electricCurrent', label: 'Electric Current' },
  { value: 'energy', label: 'Energy' },
  { value: 'force', label: 'Force' },
  { value: 'fuelConsumption', label: 'Fuel Consumption' },
  { value: 'length', label: 'Length' },
  { value: 'mass', label: 'Mass' },
  { value: 'power', label: 'Power' },
  { value: 'pressure', label: 'Pressure' },
  { value: 'speed', label: 'Speed' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'time', label: 'Time' },
  { value: 'volume', label: 'Volume' },
]

export const converterOptions = {
  angle: ['deg', 'rad', 'grad', 'arcmin', 'arcsec'],
  area: ['m2', 'km2', 'cm2', 'mm2', 'ha', 'acre', 'ft2', 'in2'],
  bitsBytes: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'B', 'KB', 'MB', 'GB', 'TB', 'KiB', 'MiB', 'GiB'],
  density: ['kg/m3', 'g/cm3', 'g/mL', 'lb/ft3', 'lb/in3'],
  electricCurrent: ['A', 'mA', 'uA', 'kA'],
  energy: ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh', 'eV', 'BTU'],
  force: ['N', 'kN', 'dyne', 'lbf', 'kgf'],
  fuelConsumption: ['L/100km', 'km/L', 'mpg(US)', 'mpg(UK)'],
  length: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in', 'nmi'],
  mass: ['kg', 'g', 'mg', 't', 'lb', 'oz', 'stone'],
  power: ['W', 'kW', 'MW', 'hp', 'BTU/h'],
  pressure: ['Pa', 'kPa', 'bar', 'psi', 'atm', 'mmHg', 'torr'],
  speed: ['m/s', 'km/h', 'mph', 'ft/s', 'knot'],
  temperature: ['C', 'F', 'K'],
  time: ['ms', 's', 'min', 'h', 'day', 'week', 'month', 'year'],
  volume: ['m3', 'L', 'mL', 'cm3', 'ft3', 'in3', 'gal(US)', 'gal(UK)'],
}

// Converts between units for all supported measurement categories.
export function convertValue(category, fromUnit, toUnit, inputValue) {
  const value = Number(inputValue)

  if (Number.isNaN(value)) {
    return ''
  }

  if (fromUnit === toUnit) {
    return formatValue(value)
  }

  if (category === 'temperature') {
    return convertTemperature(fromUnit, toUnit, value)
  }

  if (category === 'fuelConsumption') {
    return convertFuelConsumption(fromUnit, toUnit, value)
  }

  const factors = unitFactorsByCategory[category]

  if (!factors || factors[fromUnit] == null || factors[toUnit] == null) {
    return ''
  }

  const baseValue = value * factors[fromUnit]
  const result = baseValue / factors[toUnit]

  return formatValue(result)
}

function formatValue(value) {
  if (!Number.isFinite(value)) {
    return ''
  }

  const absValue = Math.abs(value)

  if (absValue !== 0 && (absValue >= 1e10 || absValue < 1e-6)) {
    return value.toExponential(8)
  }

  return Number(value.toFixed(10)).toString()
}

// Handles temperature conversions via Celsius as the pivot scale.
function convertTemperature(fromUnit, toUnit, value) {
  const toCelsius =
    fromUnit === 'C'
      ? value
      : fromUnit === 'F'
        ? ((value - 32) * 5) / 9
        : value - 273.15

  const converted =
    toUnit === 'C'
      ? toCelsius
      : toUnit === 'F'
        ? (toCelsius * 9) / 5 + 32
        : toCelsius + 273.15

  return formatValue(converted)
}

// Converts fuel efficiency/consumption using L/100km as canonical base.
function convertFuelConsumption(fromUnit, toUnit, value) {
  const toBase =
    fromUnit === 'L/100km'
      ? value
      : fromUnit === 'km/L'
        ? value === 0
          ? Number.NaN
          : 100 / value
        : fromUnit === 'mpg(US)'
          ? value === 0
            ? Number.NaN
            : 235.214583 / value
          : value === 0
            ? Number.NaN
            : 282.480936 / value

  const converted =
    toUnit === 'L/100km'
      ? toBase
      : toUnit === 'km/L'
        ? 100 / toBase
        : toUnit === 'mpg(US)'
          ? 235.214583 / toBase
          : 282.480936 / toBase

  return formatValue(converted)
}
