const u=(label,factor,offset=0)=>({label,factor,offset});
export const groups={
 length:{area:'mecanica',label:'Longitud',units:{m:u('m',1),mm:u('mm',.001),cm:u('cm',.01),km:u('km',1000),in:u('in',.0254),ft:u('ft',.3048)}},
 mass:{area:'mecanica',label:'Masa',units:{kg:u('kg',1),g:u('g',.001),t:u('t',1000),lb:u('lb (masa)',.45359237)}},
 force:{area:'mecanica',label:'Fuerza',units:{N:u('N',1),kN:u('kN',1000),kgf:u('kgf',9.80665),lbf:u('lbf',4.4482216152605)}},
 pressure:{area:'mecanica',label:'Presión',units:{Pa:u('Pa',1),kPa:u('kPa',1000),MPa:u('MPa',1e6),bar:u('bar',1e5),atm:u('atm',101325),psi:u('psi',6894.757293168),kgfcm2:u('kgf/cm²',98066.5),mH2O:u('m.c.a. (convencional)',9806.65),mmHg:u('mmHg (convencional)',133.322387415)}},
 torque:{area:'mecanica',label:'Par o momento',units:{Nm:u('N·m',1),kNm:u('kN·m',1000),lbfft:u('lbf·ft',1.3558179483314),kgfm:u('kgf·m',9.80665)}},
 energy:{area:['mecanica','electrica'],label:'Energía',units:{J:u('J',1),kJ:u('kJ',1000),Wh:u('Wh',3600),kWh:u('kWh',3.6e6),BTU:u('BTU (IT)',1055.05585262)}},
 power:{area:['mecanica','electrica'],label:'Potencia',units:{W:u('W',1),kW:u('kW',1000),MW:u('MW',1e6),hp:u('hp mecánico',745.6998715823),CV:u('CV métrico',735.49875)}},
 volume:{area:'mecanica',label:'Volumen',units:{m3:u('m³',1),L:u('L',.001),mL:u('mL',1e-6),gal:u('gal estadounidense',.003785411784)}},
 flow:{area:'mecanica',label:'Caudal volumétrico',units:{m3s:u('m³/s',1),Ls:u('L/s',.001),Lmin:u('L/min',1/60000),m3h:u('m³/h',1/3600),gpm:u('gal EE. UU./min',.003785411784/60)}},
 density:{area:'mecanica',label:'Densidad',units:{kgm3:u('kg/m³',1),gcm3:u('g/cm³',1000),lbft3:u('lb/ft³',.45359237/.3048**3)}},
 dynamic:{area:'mecanica',label:'Viscosidad dinámica',units:{Pas:u('Pa·s',1),mPas:u('mPa·s',.001),P:u('P',.1),cP:u('cP',.001)}},
 kinematic:{area:'mecanica',label:'Viscosidad cinemática',units:{m2s:u('m²/s',1),mm2s:u('mm²/s',1e-6),St:u('St',1e-4),cSt:u('cSt',1e-6)}},
 temperature:{area:'mecanica',label:'Temperatura absoluta',units:{K:u('K',1),C:u('°C',1,273.15),F:u('°F',5/9,273.15-32*5/9)},note:'Temperaturas, no diferencias de temperatura. No se admiten valores inferiores al cero absoluto.'},
 time:{area:['mecanica','electrica'],label:'Tiempo',units:{s:u('s',1),ms:u('ms',.001),us:u('µs',1e-6),min:u('min',60),h:u('h',3600)}},
 frequency:{area:['mecanica','electrica'],label:'Frecuencia y velocidad angular',units:{Hz:u('Hz',1),kHz:u('kHz',1000),MHz:u('MHz',1e6),rads:u('rad/s',1/(2*Math.PI)),rpm:u('rpm',1/60)},note:'Para movimiento periódico: ω = 2πf y rpm = 60f. Se distingue frecuencia cíclica de velocidad angular.'},
 angle:{area:'mecanica',label:'Ángulo',units:{rad:u('rad',1),deg:u('grados',Math.PI/180),rev:u('vueltas',2*Math.PI)}},
 voltage:{area:'electrica',label:'Tensión eléctrica',units:{V:u('V',1),mV:u('mV',.001),uV:u('µV',1e-6),kV:u('kV',1000)}},
 current:{area:'electrica',label:'Corriente eléctrica',units:{A:u('A',1),mA:u('mA',.001),uA:u('µA',1e-6),kA:u('kA',1000)}},
 resistance:{area:'electrica',label:'Resistencia',units:{ohm:u('Ω',1),mohm:u('mΩ',.001),kohm:u('kΩ',1000),Mohm:u('MΩ',1e6)}},
 capacitance:{area:'electrica',label:'Capacitancia',units:{F:u('F',1),mF:u('mF',.001),uF:u('µF',1e-6),nF:u('nF',1e-9),pF:u('pF',1e-12)}},
 inductance:{area:'electrica',label:'Inductancia',units:{H:u('H',1),mH:u('mH',.001),uH:u('µH',1e-6)}},
 charge:{area:'electrica',label:'Carga eléctrica',units:{C:u('C',1),mC:u('mC',.001),uC:u('µC',1e-6),Ah:u('A·h',3600),mAh:u('mA·h',3.6)},note:'A·h expresa carga, no energía. Convertir a Wh requiere conocer la tensión.'}
};
export function convert(value,groupId,from,to){
 const g=groups[groupId];if(!g||!g.units[from]||!g.units[to]||!Number.isFinite(value))throw Error('Introduce un número finito y selecciona unidades compatibles.');
 const a=g.units[from],b=g.units[to],base=value*a.factor+a.offset;
 if(groupId==='temperature'&&base< -1e-10)throw Error('La temperatura no puede ser inferior a 0 K.');
 const result=(base-b.offset)/b.factor;if(!Number.isFinite(result))throw Error('Resultado fuera del intervalo numérico.');return Object.is(result,-0)?0:result;
}
