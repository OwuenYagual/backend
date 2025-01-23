from django.shortcuts import render
from collections import Counter
# Importe requests y json
import requests
import json


# Create your views here.
from django.http import HttpResponse

# Importe el decorador login_required
from django.contrib.auth.decorators import login_required, permission_required

# Restricción de acceso con @login_required y permisos con @permission_required
@login_required
@permission_required('main.index_viewer', raise_exception=True)
def index(request):

    # Arme el endpoint del REST API
    current_url = request.build_absolute_uri()
    url = current_url + '/api/v1/landing'

    # Petición al REST API
    response_http = requests.get(url)
    response_dict = json.loads(response_http.content)

    print("Endpoint ", url)
    #print("Response ", response_dict)

    # Respuestas totales
    total_responses = len(response_dict.keys())

    # Valores de la respuesta
    responses = response_dict.values()
    #print('Responses: ', responses)


    #Fecha del primer elemento de la respuesta
    first_responses = next(iter(response_dict.items()))[1]['saved']

    #Fecha de la ultima respuesta
    last_responses = list(response_dict.items())[-1][1]['saved']

    #Fecha con mas respuestas
    dates = [row['saved'].split(',')[0] for row in responses]

    # Contamos las ocurrencias de cada fecha
    date_counts = Counter(dates)

    # Determinamos el día con más respuestas
    high_rate_responses, high_rate_responses_count = date_counts.most_common(1)[0]

    # Objeto con los datos a renderizar
    data = {
        'title': 'Landing - Dashboard',
        'total_responses': total_responses,
        'responses': responses,
        'first_responses': first_responses,
        'last_responses': last_responses,
        'high_rate_responses': high_rate_responses,
        'high_rate_responses_count': high_rate_responses_count
    }


    # Renderización en la plantilla
    return render(request, 'main/index.html', data)

