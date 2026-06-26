import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def github_profile(request, username):
    # Step 1: ask GitHub for this user's profile info
    user_url = f'https://api.github.com/users/{username}'
    user_res = requests.get(user_url)

    if user_res.status_code != 200:
        return Response({'error': 'User not found'}, status=404)

    # Step 2: ask GitHub for this user's repositories
    repos_url = f'https://api.github.com/users/{username}/repos?per_page=100'
    repos_res = requests.get(repos_url)

    user_data = user_res.json()
    repos_data = repos_res.json()
    from collections import Counter

    language_counts = Counter()
    for repo in repos_data:
        if repo.get('language'):
            language_counts[repo['language']] += 1

    top_repos = sorted(repos_data, key=lambda r: r.get('stargazers_count', 0), reverse=True)[:5]

    # Step 3: send back only the fields we actually need
    return Response({
         'profile': {
            'name': user_data.get('name'),
            'avatar': user_data.get('avatar_url'),
            'bio': user_data.get('bio'),
            'followers': user_data.get('followers'),
            'public_repos': user_data.get('public_repos'),
        },
        'languages': dict(language_counts),
        'top_repos': [
            {'name': r['name'], 'stars': r['stargazers_count'], 'url': r['html_url']}
            for r in top_repos
        ],
    })
