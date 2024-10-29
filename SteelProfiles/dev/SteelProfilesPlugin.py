import rhinoscriptsyntax as rs
import Rhino
import Rhino.UI
import System
import scriptcontext as sc
from Rhino.Commands import Command, CommandStatus
from Rhino.Geometry import *

class SteelProfilesCommand(Command):
    def __init__(self):
        self.instance = None
        self.plugin_name = "SteelProfiles"
    
    @staticmethod
    def GetPlugInId():
        return System.Guid("YOUR-UNIQUE-GUID-HERE")  # Generate a new GUID
    
    def EnglishName(self):
        return "CreateSteelProfile"

    def RunCommand(self, doc, mode):
        try:
            from .profile_generator import create_steel_extrusion
            result = create_steel_extrusion()
            return CommandStatus.Success if result else CommandStatus.Failure
        except Exception as e:
            print(f"Error: {str(e)}")
            return CommandStatus.Failure

def GetCommand():
    return SteelProfilesCommand() 