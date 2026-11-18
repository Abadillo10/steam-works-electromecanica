module.exports = function experiment(kind) {
 const barrel=kind==='barril';
 const id=barrel?'barril-densidad':'aceite-volumen';
 const label=barrel?'Densidad del aceite [kg/m³]':'Volumen del aceite [m³]';
 const min=barrel?400:1,max=barrel?1400:12,step=barrel?1:0.1;
 const initial=barrel?(1500-110)/0.159/9.81:6;
 return `<section class="fluid-experiment" data-experiment="${kind}" aria-labelledby="${id}-title">
 <h4 id="${id}-title">Explora: cambia ${barrel?'la densidad':'el volumen'}</h4>
 <p>El desarrollo de arriba corresponde al caso original. Usa estos controles para comparar otros valores.</p>
 <p class="experiment-fixed"><strong>Se mantiene fijo:</strong> ${barrel?'V = 0.159 m³ y peso del recipiente = 110 N. El peso total cambia al variar la densidad.':'peso del aceite = 47 kN. Al variar el volumen comparamos muestras con distinta densidad; no simulamos la compresión de un mismo aceite.'} En ambos casos: g = 9.81 m/s² y ρref = 1000 kg/m³.</p>
 <div class="experiment-grid"><div>
 <label for="${id}-number">${label}</label>
 <input id="${id}-number" data-number type="number" min="${min}" max="${max}" step="any" value="${initial}" aria-describedby="${id}-help ${id}-status">
 <label class="experiment-range-label" for="${id}-range">Desliza para comparar</label>
 <input id="${id}-range" data-range type="range" min="${min}" max="${max}" step="${step}" value="${initial}" aria-describedby="${id}-help">
 <p id="${id}-help">Intervalo didáctico: ${min} a ${max} ${barrel?'kg/m³':'m³'}. Puedes escribir un valor o usar las flechas del deslizador.</p>
 <button data-reset type="button">Restablecer caso original</button>
 <svg viewBox="0 0 320 170" role="img" aria-label="${barrel?'Comparación del peso total con el caso original':'Comparación del volumen con el caso original'}">
 <text x="12" y="25" fill="#12345b" font-size="14">${barrel?'Peso total [N]':'Volumen [m³]'}</text>
 <text x="12" y="55" fill="#526477" font-size="13">Original</text><rect x="12" y="63" width="${barrel?1500/(1400*0.159*9.81+110)*280:140}" height="18" fill="#a6bad0"/>
 <text x="12" y="112" fill="#12345b" font-size="13">Actual</text><rect data-bar x="12" y="120" width="140" height="18" fill="#1976d2"/>
 <text data-bar-label x="12" y="160" fill="#12345b" font-size="14"></text></svg>
 </div><div><table class="experiment-table"><caption>Resultados al instante</caption><thead><tr><th scope="col">Propiedad</th><th scope="col">Valor</th><th scope="col">Unidad</th></tr></thead><tbody data-results></tbody></table>
 <h5>Cálculo con el valor elegido</h5><ol data-steps></ol></div></div>
 <p id="${id}-status" data-status role="status" aria-live="polite" aria-atomic="true"></p>
 <noscript>Activa JavaScript para usar los controles. El caso original y su solución siguen disponibles arriba.</noscript>
 </section>`;
};
