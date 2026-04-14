from ninja import NinjaAPI

api = NinjaAPI(
    title="IntuiLab API",
    version="1.0.0",
    description="The Rediscovery Learning Platform API",
)

@api.get("/hello")
def hello(request):
    return {"message": "Welcome to IntuiLab"}

# We will register app-specific routers here later
