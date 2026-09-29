from flask import Blueprint, render_template

from institution_support import institution_registry

blueprint = Blueprint("pages", __name__)


@blueprint.get("/")
def index():
    return render_template("index.html")


@blueprint.get("/setup")
def setup():
    return render_template("setup.html")


@blueprint.get("/accounts")
def accounts_page():
    return render_template("accounts.html")


@blueprint.get("/connections")
def connections_page():
    return render_template("connections.html")


@blueprint.get("/transactions")
def transactions_page():
    return render_template("transactions.html", import_help=institution_registry().import_help())


@blueprint.get("/poc/salary-projection")
def salary_projection_poc():
    """Interactive browser-only POC for the proposed salary projection workflow."""
    return render_template("salary_projection_poc.html")
