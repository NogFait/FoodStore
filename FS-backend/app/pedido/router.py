from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlmodel import Session

from ..core.database import get_session
from ..core.deps import get_current_active_user, require_role
