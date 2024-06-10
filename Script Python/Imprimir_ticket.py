import sys
import os
import win32print
import win32api
#from escpos.printer import Usb
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch,mm
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
"""
# Obtener el texto a imprimir desde los argumentos de línea de comandos
textoNumTurno = sys.argv[1]
textoArea = sys.argv[2]

# Reemplaza los valores de 'idVendor' y 'idProduct' con los correspondientes a tu impresora
p = Usb(idVendor=0x1234, idProduct=0x5678, timeout=0, in_ep=0x81, out_ep=0x03)

# Cargar la imagen (reemplaza 'ruta/a/la/imagen.png' con la ruta real de tu imagen)
p.set(align='center')
# Imprimir la imagen
p.image('../Script Python/logo.png')

# Imprimir el título
p.set(align='center', text_type='B', width=2, height=2)
p.text("H. Ayuntamiento de Campeche\n")

# Imprimir texto de CAM
p.set(align='center', text_type='normal', width=1, height=1)
p.text("Centro de Atención Ciudadana")

# Imprimir el turno
p.set(align='center', text_type='normal', width=1, height=1)
p.text("Turno: {}\n".format(textoNumTurno))

# Imprimir el área
p.set(align='center')
p.text("Área: {}\n".format(textoArea))

# Obtener la hora actual
fecha_actual = datetime.now().strftime("%m/%d/%Y %I:%M:%S %p")

# Imprimir la hora
p.set(align='center')
p.text("Fecha: {}\n".format(fecha_actual))

# Cortar el papel (si la impresora lo soporta)
p.cut()
"""
# Obtener los valores de número de turno y área desde los argumentos de línea de comandos
num_turno = sys.argv[1]
area = sys.argv[2]

def obtener_fecha_hora():
    from datetime import datetime
    # Obtener la fecha y hora actual
    # Obtener la fecha y hora actual
    fecha_actual = datetime.now()
    # Formatear la fecha y hora en el formato deseado
    formato_fecha = fecha_actual.strftime("%d/%m/%Y %H:%M:%S")
    return formato_fecha
    
#Imprimir el PDF
def generate_ticket_pdf(num_turno, area):
    # Dimensiones de la página en mm
    page_width_mm = 80
    page_height_mm = 80

    # Convertir mm a puntos
    page_width = page_width_mm * mm
    page_height = page_height_mm * mm

    # Crear el canvas
    pdf_filename = "ticket.pdf"
    c = canvas.Canvas(pdf_filename, pagesize=(page_width, page_height))

    # Definir estilos
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    text_style = styles['Normal']

    # Ajustar el estilo del título
    title_style = ParagraphStyle(
        'title_style',
        parent=styles['Title'],
        fontSize=10,
        leading=12,
        spaceAfter=8,
        alignment=1  # Centrar el título
    )

    # Ajustar el estilo del texto normal
    text_style = ParagraphStyle(
        'text_style',
        parent=styles['Normal'],
        fontSize=10,
        leading=10,
        spaceAfter=6,
        alignment=1  # Centrar el texto
    )

    # Dimensiones de la imagen
    image_width = 35 * mm  # Ajustar el ancho de la imagen
    image_height = 35 * mm  # Ajustar el alto de la imagen

    # Centrar la imagen
    x_centered = (page_width - image_width) / 2
    y_position = page_height - image_height - 5 * mm  # Ajustar la posición vertical

    # Dibujar la imagen
    c.drawImage('../turnos_backend/Script Python/Logo-fondo-blanco.png', x_centered, y_position, width=image_width, height=image_height)

    # Dibujar el título
    title = Paragraph("H. Ayuntamiento de Campeche\n", title_style)
    title.wrapOn(c, page_width - 2*mm, image_height)
    title.drawOn(c, mm, y_position - 10 * mm)

    title2 = Paragraph("Centro de Atención Ciudadana\n", title_style)
    title2.wrapOn(c, page_width - 2* mm, image_height)
    title2.drawOn(c, mm, y_position - 16 * mm)

    # Dibujar el número de turno y el área
    textoTurno = Paragraph(f"Turno: {num_turno}\n", text_style)
    textoTurno.wrapOn(c, page_width - 2*mm, image_height)
    textoTurno.drawOn(c, mm, y_position - 22 * mm)

    textoArea = Paragraph(f"Área: {area}\n", text_style)
    textoArea.wrapOn(c, page_width - 2*mm, image_height)
    textoArea.drawOn(c, mm, y_position - 28 * mm)

    # Dibujar la fecha y hora
    fecha_hora = Paragraph("Fecha y Hora: " + obtener_fecha_hora(), text_style)
    fecha_hora.wrapOn(c, page_width - 2*mm, image_height)
    fecha_hora.drawOn(c, mm, y_position - 34 * mm)
    # Guardar el PDF
    c.showPage()
    c.save()
    try:
        os.startfile(pdf_filename)
        rutaDelPDF = "C:\\Users\\Kevin\\Desktop\\Programa Turnos\\turnos_backend\\ticket.pdf"
        #printer_name = win32print.GetDefaultPrinter()  #especifica el nombre de la impresora térmica
        # Nombre de la impresora térmica
        printer_name = "Impresora De Calor"
        printer_default = win32print.GetDefaultPrinter()
        win32print.SetDefaultPrinter(printer_name)
        win32api.ShellExecute(
            0,
            "print",
            #pdf_filename, opcion 1
            rutaDelPDF, #opcion 2
            f'/d:"{printer_name}"',
            ".",
            0
        )
    except Exception as e:
        print(f"Error al imprimir el archivo: {e}")
    finally:
        # Restaurar la impresora por defecto
        win32print.SetDefaultPrinter(printer_default)

# Generar el PDF del ticket
generate_ticket_pdf(num_turno, area)