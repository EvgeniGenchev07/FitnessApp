using Models;
namespace DBContexts;

public class UserLogin
{
    private readonly IDatabase<User, string> _userContext;
    public UserLogin(UserContext context)
    {
        _userContext = context;
    }
    public async Task<Tuple<byte,User>> Login(string email, string password)
    {
        User user = await _userContext.ReadAsync(email, true);
        if (user == null) return new Tuple<byte,User>((byte)Error.UserNotFound,null);
        if (BCrypt.Net.BCrypt.Verify(password,user.Password)) return new Tuple<byte, User>((byte)Error.Ok, user);
        return new Tuple<byte, User>((byte)Error.InvalidPassword, null);
    }

    public async Task<byte> Register(User entity)
    {
        User user = await _userContext.ReadAsync(entity.Email, true);
        if (user == null) 
        {
            await _userContext.CreateAsync(entity);
            return (byte)Error.Ok;
        }
        return (byte)Error.UserAlreadyExists;
    }
}
