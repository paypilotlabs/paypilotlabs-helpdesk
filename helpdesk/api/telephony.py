import frappe


@frappe.whitelist()
def get_call_integration_status() -> dict:
    """Call settings for the UI; everything off when the optional telephony app is not installed."""
    if "telephony" not in frappe.get_installed_apps():
        return {"twilio_enabled": False, "exotel_enabled": False, "default_calling_medium": ""}
    from telephony.api import is_call_integration_enabled

    return is_call_integration_enabled()
