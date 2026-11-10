import frappe


def execute():
    """Backfill customer_type for existing customers created before the field existed."""
    set_default_customer_type()

def set_default_customer_type():
    """Default any remaining customers without a customer_type to "Company"."""
    frappe.db.set_value(
        "HD Customer",
        {"customer_type": ["is", "not set"]},
        "customer_type",
        "Company",
        update_modified=False,
    )
