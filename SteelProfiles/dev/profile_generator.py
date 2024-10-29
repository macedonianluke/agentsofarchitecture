import rhinoscriptsyntax as rs
from Rhino.Geometry import *
from .profile_database import SteelProfileDatabase
from .profile_curves import create_profile_curve, create_perpendicular_frame

def create_steel_extrusion():
    """Main function to create steel extrusion"""
    # Initialize database
    db = SteelProfileDatabase()
    
    # Get curve selection
    curve_id = rs.GetObject("Select curve for steel extrusion", 4)
    if not curve_id: return
    
    # Let user select profile type first
    profile_types = db.get_profile_types()
    type_code = rs.ListBox(profile_types, "Select profile type", "Steel Profile Type")
    if not type_code: return
    
    # Then select specific profile
    profiles = db.get_profiles_by_type(type_code)
    profile_name = rs.ListBox(sorted(profiles.keys()), 
                            "Select profile", 
                            "Steel Profile Selection")
    if not profile_name: return
    
    profile = db.get_profile(profile_name)
    
    # Create geometry
    curve = rs.coercecurve(curve_id)
    if not curve: return
    
    start_plane = create_perpendicular_frame(curve, 0)
    profile_curve = create_profile_curve(profile, start_plane)
    
    if not profile_curve: return
    
    try:
        sweep = rs.ExtrudeCurve(profile_curve, curve_id)
        if sweep:
            group = rs.AddGroup()
            rs.AddObjectsToGroup(sweep, group)
    except Exception as e:
        print("Error creating sweep: " + str(e))
        return None
    finally:
        rs.DeleteObject(profile_curve)
    
    return sweep 