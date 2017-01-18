package com.capitalone.dashboard.service;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import com.capitalone.dashboard.auth.standard.StandardUserDetailsImpl;
import com.capitalone.dashboard.model.Authentication;
import com.capitalone.dashboard.repository.AuthenticationRepository;

@Service
public class DefaultAuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationRepository authenticationRepository;

    @Autowired
    public DefaultAuthenticationServiceImpl(
            AuthenticationRepository authenticationRepository) {
        this.authenticationRepository = authenticationRepository;
    }

    @Override
    public Iterable<Authentication> all() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Authentication get(ObjectId id) {

        Authentication authentication = authenticationRepository.findOne(id);
        return authentication;
    }

    @Override
    public org.springframework.security.core.Authentication create(String username, String password) {
        Authentication authentication = authenticationRepository.save(new Authentication(username, password));
        
        return buildAuthentication(authentication);
    }

    @Override
    public String update(String username, String password) {
        Authentication authentication = authenticationRepository.findByUsername(username);
        if (null != authentication) {
            authentication.setPassword(password);
            authenticationRepository.save(authentication);
            return "User is updated";
        } else {
            return "User Does not Exist";
        }

    }

    @Override
    public void delete(ObjectId id) {
        Authentication authentication = authenticationRepository.findOne(id);
        if (authentication != null) {
            authenticationRepository.delete(authentication);
        }
    }

    @Override
    public void delete(String username) {
        Authentication authentication = authenticationRepository
                .findByUsername(username);
        if (authentication != null) {
            authenticationRepository.delete(authentication);
        }
    }

    @Override
    public org.springframework.security.core.Authentication authenticate(String username, String password) {
        Authentication authentication = authenticationRepository.findByUsername(username);

        if (authentication != null && authentication.checkPassword(password)) {
        	return buildAuthentication(authentication);
        }

        throw new BadCredentialsException("Login Failed: Invalid credentials for user " + username);
    }

	private org.springframework.security.core.Authentication buildAuthentication(Authentication authentication) {
		StandardUserDetailsImpl details = new StandardUserDetailsImpl();
		details.setUsername(authentication.getUsername());
		details.setPassword(authentication.getPassword());
		return new UsernamePasswordAuthenticationToken(details, authentication.getPassword(), new ArrayList<GrantedAuthority>());
	}
    
}
