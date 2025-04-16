export interface BadgeType {
    name: string;
    description: string;
    color: string;
}

export const availableBadges: BadgeType[] = [
    {
        name: "新人出道",
        description: "新用户注册成功",
        color: "is-success",
    },
    {
        name: "评论家",
        description: "发表首个评论",
        color: "is-warning",
    },
    {
        name: "NyaNya~",
        description: "完成第一个作业",
        color: "is-primary",
    },
]