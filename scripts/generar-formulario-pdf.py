"""Genera el formulario descargable a partir de los mismos datos del sitio."""
import json, html
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/documentos/formulario-mecanica-fluidos.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
DATA = json.loads((ROOT / 'data/formulario-fluidos.json').read_text(encoding='utf-8'))
for name, file in [('Body','segoeui.ttf'), ('Bold','segoeuib.ttf')]:
    pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/' + file))
NAVY, BLUE, PALE = map(HexColor, ['#12345B','#1976D2','#EDF4FB'])
style = ParagraphStyle('body', fontName='Body', fontSize=8.1, leading=11, textColor=NAVY)
bold = ParagraphStyle('bold', parent=style, fontName='Bold', fontSize=8)
small = ParagraphStyle('small', parent=style, fontSize=7.1, leading=9.5)
white = ParagraphStyle('white', parent=bold, textColor=HexColor('#FFFFFF'), fontSize=10)
def p(text, s=style):
    # Preserve selectable Unicode notation; avoid unsupported precomposed dot/bar letters.
    text = text.replace('ṁ', 'ṁ').replace('ū', 'ū').replace('ᵢ','i').replace('ₙ','n')
    return Paragraph(html.escape(text).replace('\n','<br/>'), s)
def table(rows, widths, title):
    items = [[Paragraph(title,white), '']]
    for label, value, *note in rows:
        lines = value if isinstance(value,list) else [value]
        content = [p(x) for x in lines]
        if note: content += [p(note[0],small)]
        items.append([p(label,bold),content])
    t=Table(items,colWidths=widths,hAlign='LEFT')
    t.setStyle(TableStyle([
        ('SPAN',(0,0),(-1,0)),('BACKGROUND',(0,0),(-1,0),NAVY),
        ('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),
        ('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),
        ('BOTTOMPADDING',(0,0),(-1,-1),6),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[HexColor('#FFFFFF'),PALE]),
        ('LINEBELOW',(0,1),(-1,-1),.3,HexColor('#CEDCEB'))]))
    return t

W,H=landscape(A4)
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('Mecánica de fluidos - Formulario y conversiones')
c.setAuthor('STEAM Works - Electromecánica')
for page, (ca,cb,fa,fb) in enumerate([(0,8,0,9),(8,15,9,18)],1):
    c.setFillColor(BLUE); c.rect(0,H-8,W,8,fill=1,stroke=0)
    c.setFillColor(NAVY);c.setFont('Bold',19);c.drawString(28,H-40,'Mecánica de fluidos')
    c.setFont('Body',10);c.drawString(28,H-58,'Formulario y conversiones | STEAM Works - Electromecánica')
    col=(W-72)/2
    for x,rows,widths,title in [(28,DATA['conversions'][ca:cb],[109,col-109],'Conversiones frecuentes'),(44+col,DATA['formulas'][fa:fb],[112,col-112],'Fórmulas y condiciones')]:
        t=table(rows,widths,title); tw,th=t.wrap(col,H)
        assert th < H-130, (page,title,th)
        t.drawOn(c,x,H-76-th)
    c.setFillColor(NAVY);c.setFont('Body',7.2)
    footer = ['SI salvo indicación. ρ: densidad; γ = ρg; μ: viscosidad dinámica; ν: cinemática; ū: velocidad media; g ≈ 9.81 m/s².',
              'hc, hcp: profundidades verticales; θ: desde la horizontal; IG: inercia centroidal; Vd: volumen desplazado; fD: factor de Darcy.',
              'Referencias: NIST SP 811, apéndice B.9; OpenStax University Physics, vol. 1, secciones 14.5-14.7. Factores convencionales donde se indica.']
    for i,line in enumerate(footer):c.drawString(28,43-11*i,line)
    c.setFont('Bold',8);c.drawRightString(W-28,54,f'{page} / 2')
    c.showPage()
c.save()
print(OUT)
