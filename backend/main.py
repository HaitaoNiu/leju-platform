from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel

# 数据库配置
DATABASE_URL = "postgresql://postgres.clgxmhcarsuyngelgmoz:zhangxun2025@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

# 创建数据库引擎
engine = create_engine(DATABASE_URL)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()


# 定义 Order 数据模型
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    status = Column(String, nullable=False)


# Pydantic 模型用于 API 响应
class OrderResponse(BaseModel):
    id: int
    client_name: str
    status: str

    class Config:
        from_attributes = True


# 创建 FastAPI 应用
app = FastAPI(title="乐聚具身智能训练厂大中台管理平台", version="1.0.0")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 数据库依赖
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 应用启动事件：自动建表和初始化数据
@app.on_event("startup")
async def startup_event():
    # 创建所有表（如果不存在）
    Base.metadata.create_all(bind=engine)
    
    # 初始化测试数据
    db = SessionLocal()
    try:
        # 检查表中是否有数据
        existing_orders = db.query(Order).first()
        if not existing_orders:
            # 插入测试数据
            test_order = Order(
                client_name="字节跳动",
                status="进行中"
            )
            db.add(test_order)
            db.commit()
            print("已插入测试数据：客户='字节跳动', 状态='进行中'")
    except Exception as e:
        print(f"初始化数据时出错: {e}")
        db.rollback()
    finally:
        db.close()


@app.get("/")
async def hello_world():
    """Hello World 接口"""
    return {"message": "Hello World"}


@app.get("/orders", response_model=List[OrderResponse])
async def get_orders(db: Session = Depends(get_db)):
    """获取所有订单"""
    orders = db.query(Order).all()
    return orders

