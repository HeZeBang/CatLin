export interface BadgeType {
    task_id: string;
    name: string;
    description: string;
    color: string;
    is_hidden?: boolean;
}

export const availableBadges: BadgeType[] = [
    {
        task_id: "user",
        name: "新人出道",
        description: "新用户注册成功",
        color: "is-success",
    },
    {
        task_id: "M30W~",
        name: "喵~",
        description: "关于页的彩蛋",
        color: "is-error",
        is_hidden: true,
    },
    {
        task_id: "comment1",
        name: "评论家",
        description: "发表第一个评论",
        color: "is-warning",
    },
    {
        task_id: "homework1",
        name: "NyaNya~",
        description: "完成第一个作业",
        color: "is-primary",
    },
]