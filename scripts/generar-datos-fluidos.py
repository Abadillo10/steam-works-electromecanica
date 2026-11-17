"""Genera tablas reproducibles. Uso: python este_archivo --library-dir RUTA_COOLPROP."""
import argparse, json, math, pathlib, sys
parser = argparse.ArgumentParser()
parser.add_argument('--library-dir')
args = parser.parse_args()
if args.library_dir:
    sys.path.insert(0, args.library_dir)
import CoolProp
from CoolProp.CoolProp import PropsSI
root = pathlib.Path(__file__).resolve().parents[1]
pressure = 101325.0
reference = PropsSI('Dmass', 'T', 277.15, 'P', pressure, 'Water')
data = {'source': 'CoolProp', 'version': CoolProp.__version__, 'pressurePa': pressure,
        'gravity': 9.80665, 'referenceDensity': reference,
        'reference': 'Agua a 4 °C y 101325 Pa', 'stepC': 1, 'fluids': {}}
errors = {}
for key, name, fluid, start, end in [('agua', 'Agua líquida', 'Water', 5, 95), ('aire', 'Aire seco', 'Air', -20, 100)]:
    def sample(celsius):
        kelvin = celsius + 273.15
        row = {'temperatureC': celsius,
               'density': PropsSI('Dmass', 'T', kelvin, 'P', pressure, fluid),
               'viscosity': PropsSI('VISCOSITY', 'T', kelvin, 'P', pressure, fluid),
               'bulkModulus': 1 / PropsSI('ISOTHERMAL_COMPRESSIBILITY', 'T', kelvin, 'P', pressure, fluid)}
        if key == 'agua':
            row['surfaceTension'] = PropsSI('SURFACE_TENSION', 'T', kelvin, 'Q', 0, fluid)
            row['vaporPressure'] = PropsSI('P', 'T', kelvin, 'Q', 0, fluid)
        return row
    rows = [sample(t) for t in range(start, end + 1)]
    max_error = 0
    for i in range(len(rows)-1):
        for fraction in (0.25, 0.5, 0.75):
            actual = sample(start + i + fraction)
            for prop in actual:
                if prop == 'temperatureC': continue
                estimated = rows[i][prop] + fraction * (rows[i+1][prop]-rows[i][prop])
                max_error = max(max_error, abs(estimated/actual[prop]-1))
    assert max_error < 0.001, (key, max_error)
    assert all(math.isfinite(v) and v > 0 for row in rows for prop, v in row.items() if prop != 'temperatureC')
    errors[key] = max_error
    data['fluids'][key] = {'label': name, 'minC': start, 'maxC': end, 'rows': rows}
destination = root / 'data' / 'propiedades-fluidos.json'
destination.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(json.dumps({'version': CoolProp.__version__, 'rows': sum(len(f['rows']) for f in data['fluids'].values()), 'maxRelativeInterpolationError': errors}))
